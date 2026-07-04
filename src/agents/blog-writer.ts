import { Agent, callable, schedule } from "agents";
import type { Env } from "./worker";

// ── Types ──────────────────────────────────────────────────────
export type BlogPostState = {
  writtenToday: boolean;
  lastPostDate: string | null;
  totalPostsWritten: number;
  sources: string[];
  scheduleCron: string; // e.g. "0 9 * * *" = daily at 9am
};

export type BlogPostInput = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image?: string;
  date?: string;
};

// ── BlogWriterAgent ────────────────────────────────────────────
/**
 * A persistent AI agent that writes daily blog posts.
 * 
 * Features:
 * - Daily scheduling (configurable cron)
 * - Multi-source content gathering (HN, GitHub, HF, Dev.to)
 * - AI-powered article generation
 * - Direct publishing via Pages API
 * - State tracking
 */
export class BlogWriterAgent extends Agent<Env, BlogPostState> {
  /** Default state — agent starts here on first creation */
  initialState: BlogPostState = {
    writtenToday: false,
    lastPostDate: null,
    totalPostsWritten: 0,
    sources: ["hackernews", "github", "huggingface", "devto"],
    scheduleCron: "0 9 * * *", // daily at 9am
  };

  // ── Lifecycle Hooks ────────────────────────────────────────

  /** Called when the agent is first created */
  async onStart() {
    console.log(`[BlogWriter] Agent started for ${this.name}`);
    // Schedule the first daily post
    await this.scheduleNext();
  }

  // ── Scheduled Tasks ────────────────────────────────────────

  /** Schedule the next daily post */
  async scheduleNext() {
    // Cancel any existing schedule, then set a new one
    await this.schedule({
      cron: this.state.scheduleCron,
      action: "writeDailyPost",
    });
    console.log(`[BlogWriter] Scheduled next post: ${this.state.scheduleCron}`);
  }

  /** Called by the scheduler — writes a daily blog post */
  async writeDailyPost() {
    console.log("[BlogWriter] Running daily post...");
    
    // Skip if already written today
    const today = new Date().toISOString().split("T")[0];
    if (this.state.lastPostDate === today && this.state.writtenToday) {
      console.log("[BlogWriter] Already wrote today, skipping");
      return;
    }

    try {
      // 1. Gather content from sources
      const articles = await this.gatherContent();

      // 2. Pick the best article
      const bestArticle = this.pickBestArticle(articles);
      if (!bestArticle) {
        console.log("[BlogWriter] No suitable articles found, skipping");
        return;
      }

      // 3. Generate the blog post
      const post = await this.generatePost(bestArticle);

      // 4. Publish via API
      await this.publishPost(post);

      // 5. Update state
      this.setState({
        ...this.state,
        writtenToday: true,
        lastPostDate: today,
        totalPostsWritten: this.state.totalPostsWritten + 1,
      });

      console.log(`[BlogWriter] ✅ Published: "${post.title}"`);
    } catch (err) {
      console.error("[BlogWriter] Error:", err);
    }
  }

  // ── Callable Methods (callable from outside) ──────────────

  /** Manually trigger a blog post right now */
  @callable()
  async writeNow(source?: string): Promise<{ success: boolean; title?: string; error?: string }> {
    try {
      const articles = await this.gatherContent(source ? [source] : this.state.sources);
      const best = this.pickBestArticle(articles);
      if (!best) return { success: false, error: "No suitable articles found" };

      const post = await this.generatePost(best);
      await this.publishPost(post);

      const today = new Date().toISOString().split("T")[0];
      this.setState({
        ...this.state,
        writtenToday: true,
        lastPostDate: today,
        totalPostsWritten: this.state.totalPostsWritten + 1,
      });

      return { success: true, title: post.title };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /** Get current agent status */
  @callable()
  getStatus(): BlogPostState & { id: string } {
    return { ...this.state, id: this.name };
  }

  /** Change the schedule */
  @callable()
  setSchedule(cron: string): { success: boolean } {
    this.setState({ ...this.state, scheduleCron: cron });
    this.scheduleNext();
    return { success: true };
  }

  /** Reset today's flag so we can write again */
  @callable()
  resetToday(): void {
    this.setState({ ...this.state, writtenToday: false });
  }

  // ── Content Gathering ──────────────────────────────────────

  private async gatherContent(sources?: string[]): Promise<ArticleCandidate[]> {
    const toFetch = sources || this.state.sources;
    const results: ArticleCandidate[] = [];

    const fetchers: Record<string, () => Promise<ArticleCandidate[]>> = {
      hackernews: () => this.fetchHackerNews(),
      github: () => this.fetchGitHubTrending(),
      huggingface: () => this.fetchHuggingFace(),
      devto: () => this.fetchDevTo(),
    };

    for (const source of toFetch) {
      if (fetchers[source]) {
        try {
          const items = await fetchers[source]();
          results.push(...items);
        } catch (err) {
          console.error(`[BlogWriter] Failed to fetch ${source}:`, err);
        }
      }
    }

    return results;
  }

  private async fetchHackerNews(): Promise<ArticleCandidate[]> {
    const resp = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids: number[] = await resp.json();
    const top = ids.slice(0, 15);

    const items = await Promise.all(
      top.map(async (id) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        return r.json() as Promise<HNItem>;
      })
    );

    return items
      .filter((item) => item?.title && item?.url && item?.score > 50)
      .map((item) => ({
        title: item.title,
        url: item.url,
        score: item.score,
        summary: item.title,
        source: "hackernews" as const,
      }));
  }

  private async fetchGitHubTrending(): Promise<ArticleCandidate[]> {
    const resp = await fetch(
      "https://api.github.com/search/repositories?q=created:>2026-06-01&sort=stars&order=desc&per_page=10",
      {
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "BlogWriterAgent/1.0",
        },
      }
    );
    const data: any = await resp.json();
    return (data.items || []).map((repo: any) => ({
      title: repo.description || repo.name,
      url: repo.html_url,
      score: repo.stargazers_count,
      summary: repo.description || repo.name,
      source: "github" as const,
    }));
  }

  private async fetchHuggingFace(): Promise<ArticleCandidate[]> {
    const resp = await fetch("https://huggingface.co/api/daily_papers?limit=10");
    const data: any[] = await resp.json();
    return (data || []).map((paper) => ({
      title: paper.title,
      url: `https://huggingface.co/papers/${paper.id}`,
      score: paper.upvotes || 0,
      summary: paper.summary || paper.title,
      source: "huggingface" as const,
    }));
  }

  private async fetchDevTo(): Promise<ArticleCandidate[]> {
    const resp = await fetch("https://dev.to/api/articles?top=1&per_page=10");
    const data: any[] = await resp.json();
    return (data || []).map((article) => ({
      title: article.title,
      url: article.url,
      score: article.positive_reactions_count || 0,
      summary: article.description || article.title,
      source: "devto" as const,
    }));
  }

  private pickBestArticle(articles: ArticleCandidate[]): ArticleCandidate | null {
    if (articles.length === 0) return null;
    // Sort by score descending, pick the best one
    articles.sort((a, b) => b.score - a.score);
    return articles[0];
  }

  // ── AI Content Generation ──────────────────────────────────

  private async generatePost(article: ArticleCandidate): Promise<BlogPostInput> {
    const categoryMap: Record<string, string> = {
      hackernews: "🤖 AI 開發者工具",
      github: "📖 開源專案深度",
      huggingface: "🧠 AI 研究前沿",
      devto: "💻 開發者經驗",
    };

    const category = categoryMap[article.source] || "📖 開源專案深度";
    const today = new Date().toISOString().split("T")[0];

    // For now, generate a basic post with structured content
    // In production, this would use an AI model
    const content = `## 為什麼這值得關注？\n\n最近在 ${article.source} 上，有一篇關於 **${article.title}** 引起了社群的廣泛討論。\n\n> 原始連結：${article.url}\n\n這篇文章之所以值得關注，是因為它代表了當前開源生態中的一個重要趨勢。\n\n## 深入解析\n\n${article.summary}\n\n這不僅僅是一個技術更新，更是整個生態系統演進的一個縮影。\n\n## 結語\n\n如果你對這個主題感興趣，強烈建議直接查看原始內容。開源社群的力量就在於——每一個人都有機會參與、貢獻、並且從中學習。`;

    return {
      title: article.title.length > 100 ? article.title.substring(0, 97) + "..." : article.title,
      excerpt: article.summary.substring(0, 200),
      content,
      category,
      image: "",
      date: today,
    };
  }

  // ── Publishing ─────────────────────────────────────────────

  private async publishPost(post: BlogPostInput): Promise<void> {
    const apiKey = this.env.API_KEY;
    const baseUrl = this.env.BLOG_BASE_URL || "https://woody-portfolio.pages.dev";

    const resp = await fetch(`${baseUrl}/api/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(post),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Publish failed: HTTP ${resp.status} — ${text}`);
    }
  }
}

// ── Supporting Types ──────────────────────────────────────────

type ArticleCandidate = {
  title: string;
  url: string;
  score: number;
  summary: string;
  source: "hackernews" | "github" | "huggingface" | "devto";
};

type HNItem = {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  descendants: number;
};

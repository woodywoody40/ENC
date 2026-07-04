import { Agent, routeAgentRequest, callable } from "agents";

// ── Types ──────────────────────────────────────────────────────
export type BlogWriterState = {
  writtenToday: boolean;
  lastPostDate: string | null;
  totalPostsWritten: number;
  scheduleCron: string;
};

export type Env = {
  BlogWriterAgent: DurableObjectNamespace;
  API_KEY: string;
  BLOG_BASE_URL: string;
};

// ── BlogWriterAgent ────────────────────────────────────────────
export class BlogWriterAgent extends Agent<Env, BlogWriterState> {
  initialState: BlogWriterState = {
    writtenToday: false,
    lastPostDate: null,
    totalPostsWritten: 0,
    scheduleCron: "0 9 * * *",
  };

  // Lifecycle — called when agent first wakes up
  async onStart() {
    console.log(`[BlogWriter] Agent started`);
    // Set daily schedule
    await this.schedule(this.state.scheduleCron, "writeDailyPost", {});
  }

  // ── Scheduled Tasks ──────────────────────────────────────
  async writeDailyPost(_payload: any) {
    const today = new Date().toISOString().split("T")[0];
    if (this.state.lastPostDate === today && this.state.writtenToday) {
      console.log("[BlogWriter] Already wrote today, skipping");
      return;
    }

    try {
      const article = await this.fetchBestSource();
      if (!article) return;
      await this.publishPost(article);
      this.setState({
        ...this.state,
        writtenToday: true,
        lastPostDate: today,
        totalPostsWritten: this.state.totalPostsWritten + 1,
      });
    } catch (err: any) {
      console.error("[BlogWriter] Error:", err.message);
    }
  }

  // ── Callable Methods ─────────────────────────────────────
  @callable()
  async writeNow(): Promise<{ success: boolean; title?: string }> {
    try {
      const article = await this.fetchBestSource();
      if (!article) return { success: false };
      await this.publishPost(article);
      return { success: true, title: article.title };
    } catch {
      return { success: false };
    }
  }

  @callable()
  getStatus() {
    return { ...this.state };
  }

  // ── Source Fetching ──────────────────────────────────────
  private async fetchBestSource(): Promise<{ title: string; content: string; category: string } | null> {
    // Try HN first, then GitHub
    try {
      const ids: number[] = await (await fetch("https://hacker-news.firebaseio.com/v0/topstories.json")).json();
      const top5 = ids.slice(0, 5);
      const stories = await Promise.all(
        top5.map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json()))
      );
      const best = stories.filter((s: any) => s?.title && s?.url && s?.score > 30)[0];
      if (best) return { title: best.title, content: best.url, category: "AI 自動生成" };
    } catch {}

    try {
      const repos: any = await (await fetch("https://api.github.com/search/repositories?q=stars:>500&sort=stars&order=desc&per_page=5", { headers: { "User-Agent": "BlogWriter/1.0" } })).json();
      if (repos?.items?.[0]) return { title: repos.items[0].description || repos.items[0].name, content: repos.items[0].html_url, category: "開源專案" };
    } catch {}

    return null;
  }

  // ── Publishing ───────────────────────────────────────────
  private async publishPost(article: { title: string; content: string; category: string }) {
    const apiKey = this.env.API_KEY;
    const baseUrl = this.env.BLOG_BASE_URL || "https://woody-portfolio.pages.dev";
    const payload = {
      title: article.title.length > 100 ? article.title.slice(0, 97) + "..." : article.title,
      excerpt: `自動擷取：${article.title}`,
      content: `## 原文位置\n\n${article.content}\n\n*本文由 BlogWriterAgent 自動發布*`,
      category: article.category,
      date: new Date().toISOString().split("T")[0],
    };
    const resp = await fetch(`${baseUrl}/api/blog`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": apiKey },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  }
}

// ── Worker Entry Point ────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const action = url.searchParams.get("action");

    // Handle HTTP trigger for blog writing
    if (action === "write" || action === "status") {
      const agentId = env.BlogWriterAgent.idFromName("default");
      const stub = env.BlogWriterAgent.get(agentId);

      if (action === "write") {
        const result = await stub.writeNow();
        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json" },
        });
      }
      if (action === "status") {
        const status = await stub.getStatus();
        return new Response(JSON.stringify(status), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Standard agent routing (WebSocket/DO RPC)
    return (
      (await routeAgentRequest(request, env)) ??
      new Response("Not found", { status: 404 })
    );
  },
};

# Graph Report - .  (2026-07-09)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 1057 nodes · 1568 edges · 82 communities (59 shown, 23 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4593607c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- types.ts
- gray
- search
- color
- button
- slide_search_core.py
- dependencies
- spacing
- BlogWriterAgent
- App.tsx
- TestTailwindConfigGenerator
- html-token-validator.py
- BM25
- compilerOptions
- generate-slide.py
- fetch-background.py
- TailwindConfigGenerator
- DesignSystemGenerator
- ResumeEditor.tsx
- generate.py
- fontSize
- TestShadcnInstaller
- main
- design_system.py
- apiClient.ts
- _middleware.ts
- seo.tsx
- _sync_all.py
- constants.tsx
- .add_components
- AdminPage.tsx
- .generate_config_string
- primitive
- ShadcnInstaller
- test_tailwind_config_gen.py
- _search_csv
- ._base_config
- ProjectViewer3D.tsx
- generate.py
- manifest.json
- _run
- BM25
- PortfolioPage.tsx
- ThreeScene.tsx
- BlogDetailPage.tsx
- radius
- _generate_intelligent_overrides
- ProjectDetailPage.tsx
- shadow
- HomePage.tsx
- lg
- md
- xl
- none
- test_sync_brand_to_tokens.py
- main
- .test_get_installed_components_empty
- .__init__
- .test_list_installed_empty
- search.py
- publish-post.js
- .test_add_components_already_installed
- .test_add_components_subprocess_error
- .test_add_components_npx_not_found
- .test_init_dry_run
- .test_check_shadcn_config_exists
- .test_add_components_no_components
- .test_add_fonts
- .test_add_spacing
- .test_add_breakpoints
- .test_recommend_plugins
- .test_recommend_plugins_nextjs
- .test_validate_config_empty_theme
- .test_init_javascript
- .test_write_config_creates_content
- .test_custom_output_path
- .test_add_colors

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 57 edges
2. `TestTailwindConfigGenerator` - 35 edges
3. `ShadcnInstaller` - 33 edges
4. `json()` - 28 edges
5. `TestShadcnInstaller` - 26 edges
6. `compilerOptions` - 19 edges
7. `requireAuth()` - 18 edges
8. `Env` - 17 edges
9. `BlogWriterAgent` - 16 edges
10. `color` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ProjectDetailPage()` --references--> `ProjectsAPI`  [EXTRACTED]
  pages/ProjectDetailPage.tsx → services/apiClient.ts
- `TestShadcnInstaller` --uses--> `ShadcnInstaller`  [INFERRED]
  .opencode/skills/ui-styling/scripts/tests/test_shadcn_add.py → .opencode/skills/ui-styling/scripts/shadcn_add.py
- `TestGeneratedConfigIsValidJs` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .opencode/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .opencode/skills/ui-styling/scripts/tailwind_config_gen.py
- `TestTailwindConfigGenerator` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .opencode/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .opencode/skills/ui-styling/scripts/tailwind_config_gen.py
- `_generate_intelligent_overrides()` --calls--> `search()`  [INFERRED]
  .opencode/skills/ui-ux-pro-max/scripts/design_system.py → .opencode/skills/ui-ux-pro-max/scripts/core.py

## Import Cycles
- None detected.

## Communities (82 total, 23 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.09
Nodes (42): onRequestGet(), onRequestDelete(), onRequestGet(), onRequestPut(), onRequestGet(), onRequestPost(), onRequestGet(), onRequestPut() (+34 more)

### Community 1 - "gray"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 2 - "search"
Cohesion: 0.06
Nodes (42): BM25, detect_domain(), get_cip_brief(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection (+34 more)

### Community 3 - "color"
Cohesion: 0.04
Nodes (48): $type, $value, background, destructive, destructive-foreground, foreground, muted, muted-foreground (+40 more)

### Community 4 - "button"
Cohesion: 0.06
Nodes (45): $type, $value, $type, $value, bg, fg, font-size, hover-bg (+37 more)

### Community 5 - "slide_search_core.py"
Cohesion: 0.08
Nodes (36): format_context(), format_result(), main(), Format a single search result for display, Format contextual recommendations for display., BM25, calculate_pattern_break(), detect_domain() (+28 more)

### Community 6 - "dependencies"
Cohesion: 0.05
Nodes (40): dependencies, @astryxdesign/cli, @astryxdesign/core, @astryxdesign/theme-neutral, framer-motion, geist, @google/genai, jose (+32 more)

### Community 7 - "spacing"
Cohesion: 0.06
Nodes (34): $type, $value, $type, $value, $type, $value, $type, $value (+26 more)

### Community 8 - "BlogWriterAgent"
Cohesion: 0.12
Nodes (11): ArticleCandidate, BlogPostInput, BlogPostState, BlogWriterAgent, HNItem, callable, BlogWriterAgent, BlogWriterState (+3 more)

### Community 9 - "App.tsx"
Cohesion: 0.07
Nodes (17): AboutPage, AdminPage, BlogDetailPage, BlogPage, ErrorBoundary, HomePage, NotFoundPage, PortfolioPage (+9 more)

### Community 10 - "TestTailwindConfigGenerator"
Cohesion: 0.07
Nodes (15): Test adding colors multiple times., Test TailwindConfigGenerator class., Test that adding same plugin twice doesn't duplicate., Test generating TypeScript configuration., Test generating JavaScript configuration., Test generating config with custom colors., Test generating config with plugins., Test validating valid configuration. (+7 more)

### Community 11 - "html-token-validator.py"
Cohesion: 0.14
Nodes (24): get_context(), is_allowed_exception(), is_allowed_rgba(), is_inside_block(), load_css_variables(), main(), print_result(), print_summary() (+16 more)

### Community 12 - "BM25"
Cohesion: 0.11
Nodes (19): BM25, detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search across all domains and combine results (+11 more)

### Community 13 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames, isolatedModules, jsx (+13 more)

### Community 14 - "generate-slide.py"
Cohesion: 0.15
Nodes (19): _e(), generate_chart_slide(), generate_cta_slide(), generate_deck(), generate_metrics_slide(), generate_problem_slide(), generate_solution_slide(), generate_testimonial_slide() (+11 more)

### Community 15 - "fetch-background.py"
Cohesion: 0.17
Nodes (17): generate_css_for_background(), get_background_image(), get_curated_images(), get_overlay_css(), get_pexels_search_url(), load_backgrounds_config(), load_brand_colors(), main() (+9 more)

### Community 16 - "TailwindConfigGenerator"
Cohesion: 0.12
Nodes (9): Generate Tailwind CSS configuration files., Add full color palette (50-950 shades) for a base color.          Args:, TailwindConfigGenerator, Test adding full color palette., Test initialization with default settings., Test generating complete TypeScript configuration., Test initialization with different frameworks., Test base configuration structure. (+1 more)

### Community 17 - "DesignSystemGenerator"
Cohesion: 0.16
Nodes (9): DesignSystemGenerator, Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation., Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., Execute searches across multiple domains., Find matching reasoning rule for a category. (+1 more)

### Community 18 - "ResumeEditor.tsx"
Cohesion: 0.17
Nodes (15): EduItem, ExperienceItem, LinkItem, parseExperience(), parseJSONArray(), parseSkills(), ResumeData, ResumeEditor() (+7 more)

### Community 19 - "generate.py"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 20 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 21 - "TestShadcnInstaller"
Cohesion: 0.14
Nodes (8): Test adding components in dry run mode., Test successful component addition., Test ShadcnInstaller class., Test adding all components without config., Create temporary project structure., Test initialization with default project root., Test getting installed components without config., TestShadcnInstaller

### Community 22 - "main"
Cohesion: 0.13
Nodes (8): main(), Add custom font families.          Args:             fonts: Dict of font_type, Add custom spacing values.          Args:             spacing: Dict of name:, Add custom breakpoints.          Args:             breakpoints: Dict of name:, Add plugin requirements.          Args:             plugins: List of plugin n, Get plugin recommendations based on configuration.          Returns:, Validate configuration.          Returns:             Tuple of (valid, messag, Add custom colors to theme.          Args:             colors: Dict of color_

### Community 23 - "design_system.py"
Cohesion: 0.17
Nodes (16): ansi_ljust(), format_ascii_box(), format_markdown(), format_master_md(), generate_design_system(), hex_to_ansi(), persist_design_system(), Convert hex color to ANSI True Color swatch (██) with fallback. (+8 more)

### Community 24 - "apiClient.ts"
Cohesion: 0.16
Nodes (4): SOCIAL_LINKS, CERTIFICATE_IMAGES, apiClient, ConfigAPI

### Community 25 - "_middleware.ts"
Cohesion: 0.22
Nodes (12): buildArticleLd(), buildBreadcrumbLd(), buildCollectionPageLd(), buildMeta(), buildWebPageLd(), buildWebSiteLd(), DEFAULT_META, esc() (+4 more)

### Community 26 - "seo.tsx"
Cohesion: 0.16
Nodes (9): BlogPostSchema(), BreadcrumbItem, OrganizationSchema(), PersonSchema(), SEOMeta(), SEOProps, WebSiteSchema(), containerVariants (+1 more)

### Community 27 - "_sync_all.py"
Cohesion: 0.29
Nodes (13): blend(), derive_row(), derive_ui_reasoning(), h2r(), is_dark(), lum(), on_color(), r2h() (+5 more)

### Community 28 - "constants.tsx"
Cohesion: 0.22
Nodes (9): AiChat(), PROJECTS, generateContentFromPrompt(), getAiResponse(), BlogPost, ChatMessage, Project, ProjectMedia (+1 more)

### Community 29 - ".add_components"
Cohesion: 0.17
Nodes (8): main(), Add all available shadcn/ui components.          Args:             overwrite:, List installed components.          Returns:             Tuple of (success, m, Check if shadcn is initialized in project.          Returns:             True, Get list of already installed components.          Returns:             List, Read shadcn version from project package.json; fall back to a pinned default., Add shadcn/ui components.          Args:             components: List of comp, Tests for shadcn_add.py

### Community 30 - "AdminPage.tsx"
Cohesion: 0.19
Nodes (7): AdminPage(), SaveStatusExt, TabKey, Toast, AuthAPI, uploadFile(), rewriteTechnicalContent()

### Community 31 - ".generate_config_string"
Cohesion: 0.20
Nodes (6): Generate configuration file content.          Returns:             Configurat, Generate TypeScript configuration., Generate JavaScript configuration., Format plugins array for config.          Validates each plugin name against a, Add indentation to JSON string., Write configuration to file.          Returns:             Tuple of (success,

### Community 32 - "primitive"
Cohesion: 0.18
Nodes (11): fast, normal, slow, $type, $value, $type, $value, primitive (+3 more)

### Community 33 - "ShadcnInstaller"
Cohesion: 0.17
Nodes (7): Handle shadcn/ui component installation., ShadcnInstaller, Test adding components without shadcn config., Test adding components with overwrite flag., Test successful addition of all components., Test initialization with custom project root., Test checking for non-existent shadcn config.

### Community 34 - "test_tailwind_config_gen.py"
Cohesion: 0.20
Nodes (7): Tests for tailwind_config_gen.py, Reduce a generated TS/JS config to a bare assignable object so it can be     ha, Regression guard for the missing-comma bug between the ``theme`` block and, The property preceding ``plugins`` must end with a comma (pure-Python         c, The emitted config parses as valid JS via ``node --check``., _strip_to_object(), TestGeneratedConfigIsValidJs

### Community 35 - "_search_csv"
Cohesion: 0.25
Nodes (10): detect_domain(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection, Search stack-specific guidelines, search() (+2 more)

### Community 36 - "._base_config"
Cohesion: 0.22
Nodes (6): Any, Path, Initialize generator.          Args:             typescript: If True, generat, Determine default output path., Create base configuration structure., Get default content paths for framework.

### Community 37 - "ProjectViewer3D.tsx"
Cohesion: 0.20
Nodes (6): AmbientLight, Mesh, MeshStandardMaterial, PointLight, ProjectModelProps, ProjectViewerProps

### Community 38 - "generate.py"
Cohesion: 0.29
Nodes (9): enhance_prompt(), generate_batch(), generate_logo(), load_env(), main(), Enhance the logo prompt with style and industry modifiers, Generate a logo using Gemini models with image generation      Args:, Generate multiple logo variants with different styles (+1 more)

### Community 39 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 40 - "_run"
Cohesion: 0.28
Nodes (8): CompletedProcess, Path, Regression tests for validate-tokens.cjs.  The validator used to skip any line, A hardcoded hex on the same line as a var() token is still a violation., A line that references only tokens produces no false positives., _run(), test_flags_hardcoded_hex_sharing_line_with_token(), test_token_only_line_reports_no_violation()

### Community 41 - "BM25"
Cohesion: 0.28
Nodes (5): BM25, BM25 ranking algorithm for text search, Lowercase, split, remove punctuation, filter short words, Build BM25 index from documents, Score all documents against query

### Community 42 - "PortfolioPage.tsx"
Cohesion: 0.25
Nodes (8): CATEGORY_TAGS, containerVariants, defaultVis, getVis(), itemVariants, PortfolioPage(), TAG_CATEGORIES, tagVisuals

### Community 43 - "ThreeScene.tsx"
Cohesion: 0.25
Nodes (3): AmbientLight, Fog, SpotLight

### Community 44 - "BlogDetailPage.tsx"
Cohesion: 0.43
Nodes (6): BLOG_POSTS, BlogDetailPage(), escapeHtml(), getReadingMinutes(), renderInline(), BlogAPI

### Community 45 - "radius"
Cohesion: 0.29
Nodes (8): $type, $value, $type, $value, radius, default, full, default

### Community 46 - "_generate_intelligent_overrides"
Cohesion: 0.33
Nodes (6): _detect_page_type(), format_page_override_md(), _generate_intelligent_overrides(), Generate intelligent overrides based on page type using layered search., Detect page type from context and search results., Format a page-specific override file with intelligent AI-generated content.

### Community 47 - "ProjectDetailPage.tsx"
Cohesion: 0.40
Nodes (3): BreadcrumbSchema(), ProjectDetailPage(), ProjectsAPI

### Community 48 - "shadow"
Cohesion: 0.47
Nodes (6): sm, shadow, sm, sm, $type, $value

### Community 49 - "HomePage.tsx"
Cohesion: 0.53
Nodes (5): HomePage(), parseExperience(), parseSkills(), Reveal(), useReveal()

### Community 50 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 51 - "md"
Cohesion: 0.67
Nodes (4): $type, $value, md, md

### Community 52 - "xl"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 53 - "none"
Cohesion: 0.67
Nodes (4): $type, $value, none, none

## Knowledge Gaps
- **227 isolated node(s):** `$schema`, `$value`, `$type`, `$value`, `$type` (+222 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `primitive` connect `primitive` to `gray`, `color`, `spacing`, `radius`, `shadow`, `fontSize`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `color` connect `gray` to `primitive`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `spacing` connect `spacing` to `primitive`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 36 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestGeneratedConfigIsValidJs` and `.test_node_check_parses_generated_config()`) actually correct?**
  _`TailwindConfigGenerator` has 36 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `ShadcnInstaller` (e.g. with `TestShadcnInstaller` and `.test_add_all_components_dry_run()`) actually correct?**
  _`ShadcnInstaller` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Regression test for sync-brand-to-tokens.cjs.  The color parser required a par`, `Resolve token reference like {primitive.color.ocean-blue.500} to hex value.`, `Load colors from assets/design-tokens.json for overlay gradients.      Resolve` to the rest of the system?**
  _429 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09453551912568306 - nodes in this community are weakly interconnected._
# Graph Report - ENC  (2026-07-09)

## Corpus Check
- 150 files · ~187,640 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2258 nodes · 2696 edges · 174 communities (138 shown, 36 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 81 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3aea6fa6`
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
- UI Styling Skill
- Workflow
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
- seo.tsx
- Asset Organization Guide
- Primary Color Meanings
- Core Logo Types
- AdminPage.tsx
- Brand Consistency Checklist
- CIP Mockup Prompt Engineering
- Design Principles
- Design Principles
- ResumeEditor.tsx
- CIP Design Reference
- Icon Design Reference
- Copywriting Formulas
- Copywriting Formulas
- BlogDetailPage.tsx
- Banner Design - Multi-Format Creative Banner System
- Messaging Framework
- Brand Voice Framework
- Layout Patterns
- Tailwind Integration
- Layout Patterns
- apiClient.ts
- update.md
- Logo Design Reference
- design-tokens-starter.json
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- Core Visual Elements
- CIP Design Style Guide
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- tasteskill: Anti-Slop Frontend Skill
- Brand
- Slide Strategies
- button
- Slide Strategies
- ProjectViewer3D.tsx
- graphify reference: extra exports and benchmark
- PortfolioPage.tsx
- 9. AI TELLS (Forbidden Patterns)
- input
- ThreeScene.tsx
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- Slides Reference
- HTML Slide Template
- HTML Slide Template
- graphify reference: query, path, explain
- Slides
- Run and deploy your AI Studio app
- ErrorBoundary
- HomePage.tsx
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- Brand Guidelines Template
- radius
- 7. DIAL DEFINITIONS (Technical Reference)
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- padding-y
- default
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- destructive
- foreground
- muted
- muted-foreground
- primary-hover
- ring
- shadcn_add.py
- graphify.md
- extraction-spec.md
- graphify.md
- CLAUDE.md
- slides-create.md
- create.md
- .test_add_components_with_overwrite
- .test_add_components_dry_run
- .test_add_components_success
- .test_add_all_components_no_config
- .test_list_installed_no_config
- .test_init_default_project_root
- .test_get_installed_components_with_files
- .test_add_plugins_no_duplicates
- .test_init_default_typescript
- .test_write_config_invalid_path
- .test_init_framework
- .test_base_config_structure

## God Nodes (most connected - your core abstractions)
1. `TailwindConfigGenerator` - 57 edges
2. `TestTailwindConfigGenerator` - 35 edges
3. `ShadcnInstaller` - 33 edges
4. `json()` - 28 edges
5. `TestShadcnInstaller` - 26 edges
6. `compilerOptions` - 19 edges
7. `requireAuth()` - 18 edges
8. `Env` - 17 edges
9. `UI Styling Skill` - 17 edges
10. `BlogWriterAgent` - 16 edges

## Surprising Connections (you probably didn't know these)
- `TestShadcnInstaller` --uses--> `ShadcnInstaller`  [INFERRED]
  .opencode/skills/ui-styling/scripts/tests/test_shadcn_add.py → .opencode/skills/ui-styling/scripts/shadcn_add.py
- `TestGeneratedConfigIsValidJs` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .opencode/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .opencode/skills/ui-styling/scripts/tailwind_config_gen.py
- `TestTailwindConfigGenerator` --uses--> `TailwindConfigGenerator`  [INFERRED]
  .opencode/skills/ui-styling/scripts/tests/test_tailwind_config_gen.py → .opencode/skills/ui-styling/scripts/tailwind_config_gen.py
- `_generate_intelligent_overrides()` --calls--> `search()`  [INFERRED]
  .opencode/skills/ui-ux-pro-max/scripts/design_system.py → .opencode/skills/ui-ux-pro-max/scripts/core.py
- `main()` --calls--> `search()`  [INFERRED]
  .opencode/skills/design-system/scripts/search-slides.py → .opencode/skills/design-system/scripts/slide_search_core.py

## Import Cycles
- None detected.

## Communities (174 total, 36 thin omitted)

### Community 0 - "types.ts"
Cohesion: 0.07
Nodes (54): onRequestGet(), onRequestDelete(), onRequestGet(), onRequestPut(), onRequestGet(), onRequestPost(), onRequestGet(), onRequestPut() (+46 more)

### Community 1 - "gray"
Cohesion: 0.05
Nodes (53): $type, $value, $type, $value, $type, $value, $type, $value (+45 more)

### Community 2 - "search"
Cohesion: 0.06
Nodes (42): BM25, detect_domain(), get_cip_brief(), _load_csv(), Load CSV and return list of dicts, Core search function using BM25, Auto-detect the most relevant domain from query, Main search function with auto-domain detection (+34 more)

### Community 3 - "color"
Cohesion: 0.11
Nodes (19): $type, $value, background, destructive-foreground, primary, primary-foreground, secondary, secondary-foreground (+11 more)

### Community 4 - "button"
Cohesion: 0.15
Nodes (17): $type, $value, $type, $value, bg, bg, border, padding (+9 more)

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
Cohesion: 0.05
Nodes (43): Arbitrary Values, Aspect Ratio, Background Colors, Border Color, Border Radius, Border Style, Border Width, Borders (+35 more)

### Community 10 - "TestTailwindConfigGenerator"
Cohesion: 0.07
Nodes (15): Test adding colors multiple times., Test adding custom breakpoints., Test TailwindConfigGenerator class., Test generating TypeScript configuration., Test generating JavaScript configuration., Test generating config with custom colors., Test generating config with plugins., Test validating valid configuration. (+7 more)

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
Cohesion: 0.10
Nodes (11): Generate Tailwind CSS configuration files., Add full color palette (50-950 shades) for a base color.          Args:, TailwindConfigGenerator, Test adding full color palette., Test adding custom spacing., Test plugin recommendations for Next.js., Test validating config with no content paths., Test writing configuration to file. (+3 more)

### Community 17 - "DesignSystemGenerator"
Cohesion: 0.16
Nodes (9): DesignSystemGenerator, Select best matching result based on priority keywords., Extract results list from search result dict., Generate complete design system recommendation., Generates design system recommendations from aggregated searches., Load reasoning rules from CSV., Execute searches across multiple domains., Find matching reasoning rule for a category. (+1 more)

### Community 18 - "ResumeEditor.tsx"
Cohesion: 0.05
Nodes (37): 1. Color Palette, 2. Typography, 3. Logo Usage, 4. Voice & Tone, 5. Imagery Guidelines, 6. Design Components, Accessibility, AI Image Generation (+29 more)

### Community 19 - "generate.py"
Cohesion: 0.20
Nodes (15): apply_color(), apply_viewbox_size(), extract_svgs(), generate_batch(), generate_icon(), generate_sizes(), load_env(), main() (+7 more)

### Community 20 - "fontSize"
Cohesion: 0.12
Nodes (16): $type, $value, $type, $value, $type, $value, $type, $value (+8 more)

### Community 21 - "TestShadcnInstaller"
Cohesion: 0.17
Nodes (7): Handle shadcn/ui component installation., ShadcnInstaller, Test component addition with subprocess error., Test listing installed components when they exist., Test initialization with custom project root., Test checking for existing shadcn config., Test getting installed components without config.

### Community 22 - "main"
Cohesion: 0.13
Nodes (8): main(), Add custom font families.          Args:             fonts: Dict of font_type, Add custom spacing values.          Args:             spacing: Dict of name:, Add custom breakpoints.          Args:             breakpoints: Dict of name:, Add plugin requirements.          Args:             plugins: List of plugin n, Get plugin recommendations based on configuration.          Returns:, Validate configuration.          Returns:             Tuple of (valid, messag, Add custom colors to theme.          Args:             colors: Dict of color_

### Community 23 - "design_system.py"
Cohesion: 0.17
Nodes (16): ansi_ljust(), format_ascii_box(), format_markdown(), format_master_md(), generate_design_system(), hex_to_ansi(), persist_design_system(), Convert hex color to ANSI True Color swatch (██) with fallback. (+8 more)

### Community 24 - "apiClient.ts"
Cohesion: 0.06
Nodes (35): Banner Design (Built-in), Banner: Design Rules, Banner: Quick Size Reference, Banner: Top Art Styles, Banner: Workflow, CIP Design (Built-in), CIP: Generate Brief, CIP: Generate Mockups (+27 more)

### Community 25 - "_middleware.ts"
Cohesion: 0.06
Nodes (35): 1. Visual Communication First, 2. Minimal Text Integration, 3. Expert Craftsmanship, 4. Systematic Patterns, Analog Meditation, Approach, Canvas Boundaries, Canvas Design System (+27 more)

### Community 26 - "seo.tsx"
Cohesion: 0.06
Nodes (32): Accordion, Alert, Alert Dialog, Avatar, Badge, Button, Card, Checkbox (+24 more)

### Community 27 - "_sync_all.py"
Cohesion: 0.29
Nodes (13): blend(), derive_row(), derive_ui_reasoning(), h2r(), is_dark(), lum(), on_color(), r2h() (+5 more)

### Community 28 - "constants.tsx"
Cohesion: 0.06
Nodes (32): 1. Mobile-First Design, 2. Consistent Breakpoint Usage, 3. Test at Breakpoint Boundaries, 4. Use Container for Content Width, 5. Progressive Enhancement, 6. Avoid Too Many Breakpoints, Best Practices, Breakpoint System (+24 more)

### Community 29 - ".add_components"
Cohesion: 0.22
Nodes (7): main(), Add all available shadcn/ui components.          Args:             overwrite:, List installed components.          Returns:             Tuple of (success, m, Check if shadcn is initialized in project.          Returns:             True, Get list of already installed components.          Returns:             List, Read shadcn version from project package.json; fall back to a pinned default., Add shadcn/ui components.          Args:             components: List of comp

### Community 30 - "AdminPage.tsx"
Cohesion: 0.06
Nodes (32): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Common Sticking Points, Example Workflow, How to Use This Skill, Icons & Visual Elements (+24 more)

### Community 31 - ".generate_config_string"
Cohesion: 0.20
Nodes (6): Generate configuration file content.          Returns:             Configurat, Generate TypeScript configuration., Generate JavaScript configuration., Format plugins array for config.          Validates each plugin name against a, Add indentation to JSON string., Write configuration to file.          Returns:             Tuple of (success,

### Community 32 - "primitive"
Cohesion: 0.18
Nodes (11): fast, normal, slow, $type, $value, $type, $value, primitive (+3 more)

### Community 33 - "ShadcnInstaller"
Cohesion: 0.12
Nodes (9): Test adding components without shadcn config., Test adding components that are already installed., Test ShadcnInstaller class., Test adding all components in dry run mode., Create temporary project structure., Test successful addition of all components., Test listing installed components when none exist., Test checking for non-existent shadcn config. (+1 more)

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
Cohesion: 0.06
Nodes (30): Accessibility, Base System, Best Practices, Clean & Modern, Common Font Pairings, Contrast Requirements, CSS Implementation, Editorial (+22 more)

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
Cohesion: 0.07
Nodes (28): Absolute Don'ts, Approved Backgrounds, Before Using Logo, Clear Space, Co-branding, Color Rules, Color Usage, Color Variants (+20 more)

### Community 43 - "ThreeScene.tsx"
Cohesion: 0.07
Nodes (28): Alert, Anatomy, Anatomy, Anatomy, Anatomy, Anatomy, Badge, Button (+20 more)

### Community 44 - "BlogDetailPage.tsx"
Cohesion: 0.07
Nodes (28): Accordion, Alert, ARIA Labels, Checkbox and Radio, Color Contrast, Command Palette Navigation, Component-Specific Patterns, Dialog/Modal Navigation (+20 more)

### Community 45 - "radius"
Cohesion: 0.29
Nodes (8): $type, $value, $type, $value, radius, full, md, md

### Community 46 - "_generate_intelligent_overrides"
Cohesion: 0.33
Nodes (6): _detect_page_type(), format_page_override_md(), _generate_intelligent_overrides(), Generate intelligent overrides based on page type using layered search., Detect page type from context and search results., Format a page-specific override file with intelligent AI-generated content.

### Community 47 - "ProjectDetailPage.tsx"
Cohesion: 0.08
Nodes (25): Accessibility, Archival, Asset Approval Checklist, Automation Support, Color Compliance, Common Issues & Fixes, Content Accessibility, Content Quality (+17 more)

### Community 48 - "shadow"
Cohesion: 0.47
Nodes (6): sm, shadow, sm, sm, $type, $value

### Community 49 - "HomePage.tsx"
Cohesion: 0.08
Nodes (25): Common Pitfalls, Core Prompt Structure, Detailed Brief, Eco/Sustainable, Effective Keywords by Style, Fashion Brand, Healthcare, Industry-Specific Prompts (+17 more)

### Community 50 - "lg"
Cohesion: 0.60
Nodes (5): lg, $type, $value, lg, lg

### Community 51 - "md"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 52 - "xl"
Cohesion: 0.67
Nodes (4): xl, xl, $type, $value

### Community 53 - "none"
Cohesion: 0.67
Nodes (4): $type, $value, none, none

### Community 58 - ".test_list_installed_empty"
Cohesion: 0.08
Nodes (24): Accessibility Requirements, Brand Compliance Validation, Checking Contrast, Color Documentation Format, Color Extraction, Color Palette Examples, Color Palette Management, Color System Structure (+16 more)

### Community 62 - ".test_add_components_already_installed"
Cohesion: 0.08
Nodes (24): Apparel, Business Card, Car/Sedan, CIP Deliverable Guide, Core Identity, Digital Assets, Email Signature, Envelope (+16 more)

### Community 63 - ".test_add_components_subprocess_error"
Cohesion: 0.08
Nodes (24): Accessibility, Accessibility Requirements, ARIA States, Color Contrast, Color Variants, Disabled States, Error Messages, Error States (+16 more)

### Community 65 - "UI Styling Skill"
Cohesion: 0.08
Nodes (24): Accessibility Patterns, Alternative: Tailwind-Only Setup, Best Practices, Common Patterns, Component Layer: shadcn/ui, Component Library Guide, Component + Styling Setup, Core Stack (+16 more)

### Community 66 - "Workflow"
Cohesion: 0.08
Nodes (23): Art Direction Styles (Reuse from Banner), Color & Contrast, Design Best Practices, HTML Design Rules, HTML Template Structure, Option A: Chrome Headless CLI (Recommended — zero dependencies), Option B: chrome-devtools skill, Option C: Playwright script (+15 more)

### Community 68 - ".test_check_shadcn_config_exists"
Cohesion: 0.09
Nodes (22): Best Practices, Chart.js Integration, Command, Component Spec Pattern, Contextual Decision Flow, Decision System CSVs, Design System, Integration (+14 more)

### Community 71 - ".test_add_spacing"
Cohesion: 0.09
Nodes (22): @apply Directive, Best Practices, Color Customization, Complete Tailwind Config, Configuration Examples, Content Configuration, Custom Color Palette, Custom Font Sizes (+14 more)

### Community 72 - ".test_add_breakpoints"
Cohesion: 0.09
Nodes (16): AboutPage, AdminPage, BlogDetailPage, BlogPage, HomePage, NotFoundPage, PortfolioPage, ProjectDetailPage (+8 more)

### Community 74 - ".test_recommend_plugins_nextjs"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 75 - ".test_validate_config_empty_theme"
Cohesion: 0.10
Nodes (19): Banner Design Tasks, Brand Identity Tasks, Component Creation, Corporate Identity Program Tasks, Design Routing Guide, Design System Migration, Icon Design Tasks, Implementation Tasks (+11 more)

### Community 79 - ".test_add_colors"
Cohesion: 0.10
Nodes (19): Base Color Presets, Best Practices, Color Customization, Color Format, Component Customization, CSS Variable System, Customize Styles, Customize Variants (+11 more)

### Community 84 - "seo.tsx"
Cohesion: 0.13
Nodes (12): BlogPostSchema(), BreadcrumbItem, BreadcrumbSchema(), OrganizationSchema(), PersonSchema(), SEOMeta(), SEOProps, WebSiteSchema() (+4 more)

### Community 85 - "Asset Organization Guide"
Cohesion: 0.11
Nodes (18): Asset Entry (manifest.json), Asset Organization Guide, By Campaign, By Status, By Type, Cleanup Workflow, Components, Directory Structure (+10 more)

### Community 86 - "Primary Color Meanings"
Cohesion: 0.11
Nodes (18): Accessibility Considerations, Analogous, Black, Blue, Color Combinations by Industry, Color Harmony Types, Complementary, Green (+10 more)

### Community 87 - "Core Logo Types"
Cohesion: 0.11
Nodes (18): 1. Wordmark (Logotype), 2. Lettermark (Monogram), 3. Pictorial Mark (Brand Mark), 4. Abstract Mark, 5. Mascot, 6. Emblem, 7. Combination Mark, Aesthetic Styles (+10 more)

### Community 88 - "AdminPage.tsx"
Cohesion: 0.15
Nodes (11): AiChat(), AdminPage(), SaveStatusExt, TabKey, Toast, AuthAPI, uploadFile(), generateContentFromPrompt() (+3 more)

### Community 89 - "Brand Consistency Checklist"
Cohesion: 0.11
Nodes (17): Audit Frequency, Brand Consistency Checklist, Channel Audit, Collateral, Colors, Common Issues, Email, Imagery (+9 more)

### Community 90 - "CIP Mockup Prompt Engineering"
Cohesion: 0.11
Nodes (17): Apparel (Polo/T-Shirt), Base Prompt Structure, Business Card, CIP Mockup Prompt Engineering, Context Modifiers, Corporate Minimal, Deliverable-Specific Modifiers, Letterhead (+9 more)

### Community 91 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 92 - "Design Principles"
Cohesion: 0.12
Nodes (15): 22 Art Direction Styles, Banner Sizes & Art Direction Styles Reference, Complete Banner Sizes, CTA Rules, Design Principles, Pinterest Research Queries, Print, Print Specs (+7 more)

### Community 93 - "ResumeEditor.tsx"
Cohesion: 0.17
Nodes (15): EduItem, ExperienceItem, LinkItem, parseExperience(), parseJSONArray(), parseSkills(), ResumeData, ResumeEditor() (+7 more)

### Community 94 - "CIP Design Reference"
Cohesion: 0.13
Nodes (14): CIP Brief (Start Here), CIP Design Reference, Commands, Deliverable Categories, Design Styles, Detailed References, Generate Mockups, HTML Presentation Features (+6 more)

### Community 95 - "Icon Design Reference"
Cohesion: 0.13
Nodes (14): Available Styles, CLI Options, Commands, Generate Batch Variations, Generate Multiple Sizes, Generate Single Icon, Icon Categories, Icon Design Reference (+6 more)

### Community 96 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 97 - "Copywriting Formulas"
Cohesion: 0.13
Nodes (14): AIDA (Attention-Interest-Desire-Action), Before-After-Bridge, Contrast Patterns, Copywriting Formulas, Core Formulas, Cost of Inaction, FAB (Features-Advantages-Benefits), Formula-to-Slide Mapping (+6 more)

### Community 98 - "BlogDetailPage.tsx"
Cohesion: 0.21
Nodes (11): BLOG_POSTS, PROJECTS, BlogDetailPage(), escapeHtml(), getReadingMinutes(), renderInline(), BlogAPI, BlogPost (+3 more)

### Community 99 - "Banner Design - Multi-Format Creative Banner System"
Cohesion: 0.14
Nodes (13): Art Direction Styles (Top 10), Banner Design - Multi-Format Creative Banner System, Banner Size Quick Reference, Design Rules, Prerequisites, Security, Step 1: Gather Requirements (AskUserQuestion), Step 2: Research & Art Direction (+5 more)

### Community 100 - "Messaging Framework"
Cohesion: 0.14
Nodes (13): Core Statements, Elevator Pitches, Framework Structure, Message Architecture, Message by Audience, Message Testing, Messaging Framework, Mission Statement (+5 more)

### Community 101 - "Brand Voice Framework"
Cohesion: 0.14
Nodes (13): Brand Voice Framework, Character Spectrum, Emotion Spectrum, Language Spectrum, Step 1: Define Personality Traits, Step 2: Create Voice Chart, Step 3: Context Adaptation, Tone Spectrum (+5 more)

### Community 102 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 103 - "Tailwind Integration"
Cohesion: 0.14
Nodes (13): Animation Tokens, Base Layer, Button Example, Component Classes, CSS Variables Setup, Dark Mode Toggle, HSL Format Benefits, shadcn/ui Alignment (+5 more)

### Community 104 - "Layout Patterns"
Cohesion: 0.14
Nodes (13): Card Styles, Component Variants, CSS Structures, Feature Grid (3 columns), Layout Decision Flow, Layout Patterns, Layout Selection by Use Case, Metric Styles (+5 more)

### Community 105 - "apiClient.ts"
Cohesion: 0.16
Nodes (4): SOCIAL_LINKS, CERTIFICATE_IMAGES, apiClient, ConfigAPI

### Community 106 - "update.md"
Cohesion: 0.15
Nodes (12): Color Presets, Examples, Files Modified, Important, Overview, Skills Used, Step 1: Gather Brand Input, Step 2: Update Brand Guidelines (+4 more)

### Community 107 - "Logo Design Reference"
Cohesion: 0.15
Nodes (12): Available Styles, Color Psychology, Commands, Design Brief (Start Here), Detailed References, Generate Logo, Industry Defaults, Logo Design Reference (+4 more)

### Community 108 - "design-tokens-starter.json"
Cohesion: 0.15
Nodes (12): component, $type, $value, dark, semantic, $schema, $type, $value (+4 more)

### Community 109 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 110 - "Core Visual Elements"
Cohesion: 0.18
Nodes (10): Color Palette, Colors, Core Visual Elements, Logo, Logo, Quick Checks, Typography, Typography (+2 more)

### Community 111 - "CIP Design Style Guide"
Cohesion: 0.18
Nodes (10): Bold Dynamic, CIP Design Style Guide, Classic Traditional, Color Psychology, Corporate Minimal, Fresh Modern, Luxury Premium, Modern Tech (+2 more)

### Community 112 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 113 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 114 - "Brand"
Cohesion: 0.20
Nodes (9): Brand, Brand Sync Workflow, Quick Start, References, Routing, Scripts, Subcommands, Templates (+1 more)

### Community 115 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 116 - "button"
Cohesion: 0.20
Nodes (10): fg, font-size, hover-bg, button, $type, $value, $type, $value (+2 more)

### Community 117 - "Slide Strategies"
Cohesion: 0.20
Nodes (9): Common Structures, Duarte Sparkline Pattern, Matching Strategy to Context, Product Demo (6 slides), Sales Pitch (9 slides), Search Commands, Slide Strategies, Strategy Selection (+1 more)

### Community 118 - "ProjectViewer3D.tsx"
Cohesion: 0.20
Nodes (6): AmbientLight, Mesh, MeshStandardMaterial, PointLight, ProjectModelProps, ProjectViewerProps

### Community 119 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 120 - "PortfolioPage.tsx"
Cohesion: 0.25
Nodes (8): CATEGORY_TAGS, containerVariants, defaultVis, getVis(), itemVariants, PortfolioPage(), TAG_CATEGORIES, tagVisuals

### Community 121 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 122 - "input"
Cohesion: 0.29
Nodes (8): padding-x, input, $type, $value, focus-ring, padding-x, $type, $value

### Community 123 - "ThreeScene.tsx"
Cohesion: 0.25
Nodes (3): AmbientLight, Fog, SpotLight

### Community 124 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 125 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 126 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 127 - "Slides Reference"
Cohesion: 0.29
Nodes (6): Key Features, Knowledge Base, Slides Reference, Usage, When to Use, Workflow

### Community 128 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 129 - "HTML Slide Template"
Cohesion: 0.29
Nodes (6): Animation Classes, Background Images, Base Structure, Chart.js Integration, CSS Variables Reference, HTML Slide Template

### Community 130 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 131 - "Slides"
Cohesion: 0.33
Nodes (5): References (Knowledge Base), Routing, Slides, Subcommands, When to Use

### Community 132 - "Run and deploy your AI Studio app"
Cohesion: 0.33
Nodes (5): Architecture, Cloudflare Access 設定, Deploy to Cloudflare Pages, Run and deploy your AI Studio app, Run Locally

### Community 134 - "HomePage.tsx"
Cohesion: 0.53
Nodes (5): HomePage(), parseExperience(), parseSkills(), Reveal(), useReveal()

### Community 135 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 136 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 137 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 138 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 139 - "Brand Guidelines Template"
Cohesion: 0.40
Nodes (4): Brand Guidelines Template, Document Structure, Extractable Fields, Usage

### Community 140 - "radius"
Cohesion: 0.60
Nodes (5): radius, radius, radius, $type, $value

### Community 141 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 142 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 143 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 144 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 145 - "padding-y"
Cohesion: 0.67
Nodes (4): padding-y, padding-y, $type, $value

### Community 146 - "default"
Cohesion: 0.67
Nodes (4): $type, $value, default, default

### Community 149 - "destructive"
Cohesion: 0.67
Nodes (3): destructive, $type, $value

### Community 150 - "foreground"
Cohesion: 0.67
Nodes (3): foreground, $type, $value

### Community 151 - "muted"
Cohesion: 0.67
Nodes (3): muted, $type, $value

### Community 152 - "muted-foreground"
Cohesion: 0.67
Nodes (3): muted-foreground, $type, $value

### Community 153 - "primary-hover"
Cohesion: 0.67
Nodes (3): primary-hover, $type, $value

### Community 154 - "ring"
Cohesion: 0.67
Nodes (3): ring, $type, $value

## Knowledge Gaps
- **1112 isolated node(s):** `$schema`, `$value`, `$type`, `$value`, `$type` (+1107 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `primitive` connect `primitive` to `gray`, `spacing`, `design-tokens-starter.json`, `radius`, `shadow`, `fontSize`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `color` connect `gray` to `primitive`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Why does `component` connect `design-tokens-starter.json` to `input`, `button`, `button`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 36 inferred relationships involving `TailwindConfigGenerator` (e.g. with `TestGeneratedConfigIsValidJs` and `.test_node_check_parses_generated_config()`) actually correct?**
  _`TailwindConfigGenerator` has 36 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `ShadcnInstaller` (e.g. with `TestShadcnInstaller` and `.test_add_all_components_dry_run()`) actually correct?**
  _`ShadcnInstaller` has 23 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Regression test for sync-brand-to-tokens.cjs.  The color parser required a par`, `Resolve token reference like {primitive.color.ocean-blue.500} to hex value.`, `Load colors from assets/design-tokens.json for overlay gradients.      Resolve` to the rest of the system?**
  _1326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07027027027027027 - nodes in this community are weakly interconnected._
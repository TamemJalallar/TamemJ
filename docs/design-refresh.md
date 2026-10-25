# Design refresh — October 24, 2026

## Installed references

- Taste: https://github.com/Leonxlnx/taste-skill — installed as `~/.codex/skills/design-taste-frontend`.
- Motion: https://github.com/kylezantos/design-motion-principles — installed as `~/.codex/skills/design-motion-principles`.
- VoltAgent: https://github.com/VoltAgent/awesome-claude-design — saved to `~/.codex/design-references/awesome-claude-design`. This repository is an index, not a SKILL.md package. Its linked Vercel reference was obtained from VoltAgent/awesome-design-md because getdesign.md returned 403.

## Brief and decisions

User scope: clean up both the main website and wedding gallery. Keep content and functionality, with no new paid hosting.

Inventory: TamemJ name; existing blue accent; Microsoft 365 fixes; Windows endpoint guides; 226 support tickets; 233 tech fixes; 10 pillar guides; 99 downloads; managed IT services; 1,541 wedding images; original photo numbers; garden portrait NG-0451.

Main direction: Taste’s “The product performs,” seed 865652043. The real TamemJ resource library becomes the first working interface on the page: search plus direct resource links and real counts. Claims: find a fix (working search); start with a known issue (existing articles); understand the system (existing guides); get the tools (existing downloads); request help (existing services/contact).

Gallery direction: “The place carries it,” seed 1032943792. The couple’s garden portrait becomes the opening composition. Existing image proportions and photo numbers carry the album, with search and individual downloads.

Adaptations: kept existing typography and blue identity for the main site. The gallery retains its serif typography and takes its green/white palette from the garden portrait instead of the dealt black/crimson. The dealt conference agenda/switch layouts do not match this library’s content, so real article lists replace them. No invented quotations, counts, wedding date, stock photographs, or interface screenshots. The real article browsing interface is the content, not a decorative product mockup.

Motion follows Emil first, Jakub second: frequent search and photo navigation are instant; pointer-opened photo viewer enters over 220ms with opacity and a 6px translation; keyboard opening is immediate. Reduced-motion preferences disable generated motion. This deliberately favors the motion skill’s frequency gate over Taste’s minimum count of moving elements.

## Changes

- Rebuilt homepage hierarchy, working search, direct library navigation, readable article rows, guides, downloads, and contact section.
- Simplified shared surfaces, buttons, header and footer across existing pages while keeping routes and theme support.
- Added skip-to-content; Escape closes navigation; mobile navigation scrolls within viewport.
- Wedding cover uses existing photo NG-0451; thumbnails retain their proportions; new batches do not rebalance previous photo columns.
- Wedding assets remain optimized copies; original files unchanged.

## Verification

TypeScript check passed. Final production static export passed for all 1,395 pages, including the mobile heading fix and stable gallery batch change. The existing fantasy export repair script also passed.
Taste source lint passed for homepage and gallery. Browser review uses the supported Codex browser tools rather than the skill’s separate browser driver; no claim is made that Taste’s automated rendered inspector passed. Browser review covers desktop, tablet, and mobile previews, light/dark theme, gallery search, modal, Escape, and incremental loading. Reduced-motion guards are checked in source; OS-level emulation is not available in this browser surface.

## Visual review

ROUND 1
Seen in one second: a useful IT search, or the couple’s garden portrait.
Idea: the existing resources and original photographs are the design’s substance.
Live thing: real search; real photo viewer.
Layout words by section: home hero=search/directory / fixes=list / guides=split / downloads=columns / contact=band; gallery hero=photograph / collection=album.
Scores (subjective): design 7.5 · usability 8 · creativity 6.5 · content 8 → overall 7.5.
Caps applied: no claim of award-level originality; the main site intentionally uses familiar library navigation.
Top three problems and fixes:
1. Mobile homepage hero wrapped into three lines at 390px: changed the explicit break to “Find your / next IT fix.”
2. Additional photos could rebalance existing columns: append independent photo batches.
3. Original gallery forced portrait crops: render natural image proportions.

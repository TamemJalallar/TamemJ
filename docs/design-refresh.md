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

## Photo organization follow-up

The existing “The place carries it” direction remains unchanged; this update is a gallery-control component and did not need a new design draw. The photo number sequence now becomes the navigation device: six story chapters filter the real collection while preserving search, deep links, downloads, and the fullscreen viewer.

The chapters are Getting Ready (NG-0001–NG-0225), First Look & Portraits (NG-0226–NG-0466), Family Portraits (NG-0467–NG-0559), Ceremony & Traditions (NG-0560–NG-0777), Reception Details (NG-0778–NG-0889), and Celebration (NG-0890–NG-1541).

ROUND 2

Seen in one second: the album can be browsed as a story or searched by photo number.
Hierarchy: the collection title, count, search, chapter controls, and photographs read in that order on desktop and phone.
Interaction: selected chapters have visible state and `aria-pressed`; the horizontal phone control row exposes the next chapter at the edge; search operates within the selected chapter; shared chapter URLs use `?chapter=`.
Scores (subjective): design 8 · usability 9 · creativity 6.5 · content 8.5 → overall 8.0.
Remaining limit: chapter boundaries were visually reviewed from the chronological sequence and are intentionally broad; individual photos are not tagged by person.

Verification: Taste source lint passed with 0 FAIL and 0 WARN. Browser checks covered all six counts and starting photos, the Family Portraits ending boundary, chapter-scoped search, viewer open/Escape close, a 390px phone viewport, and a 1280px desktop viewport with no horizontal page overflow. The final static export passed for all 1,395 pages, and the existing fantasy recap export repair completed for five pages.

## Two-person selection room — November 12, 2026

The private selection room lives at `/wedding/select/` and uses Taste's `editorial-greeting` app direction, seed 287929552. It keeps the public album's garden-derived green, white ground, serif headings, and natural photo proportions. The working interface is the composition: a restrained progress panel, three list tabs, search and chapter controls, then the photographs themselves.

Each person receives a different unguessable link. The access token identifies the viewer as Tamem or his wife; only the token hashes are committed. Each person can add or remove only their own choices. “Both picks” is calculated from the intersection of the two independent lists, so it cannot drift into a third manually edited list. The interface syncs immediately, polls while open on separate devices, caches the last good state, retries offline changes, and exports the shared photo numbers as CSV.

Only photo numbers and selected states are sent to the existing Cloudflare Worker and stored in its existing KV namespace. The original photographs remain static website assets. The browser uses `no-referrer`, the API is limited to the production origin, and invalid tokens or photo numbers are rejected.

Motion follows the earlier frequency rule: filtering and pick changes are immediate; only a pointer-opened fullscreen viewer receives a brief 180ms opacity/6px entrance. Reduced-motion preferences disable generated motion.

Verification: TypeScript strict compilation passed. A mocked-KV Worker test covered both identities, independent writes, automatic intersection, role isolation, invalid credentials, and invalid photo numbers. JavaScript syntax validation passed. Taste app-source lint passed with 0 FAIL and 0 WARN.

### Free-tier synchronization update

The original per-photo storage model required two KV list operations every eight seconds. The free tier permits far fewer list operations than ordinary reads, so this could exhaust the daily list allowance during a long selection session.

The v2 model stores one sorted photo-number array per person. A normal refresh now performs two ordinary KV reads and zero lists. The first v2 request migrates existing v1 per-photo keys once and leaves those legacy keys dormant. Rapid choices are batched into a single role-specific write, writes are spaced to respect the same-key rate limit, polling runs every 30 seconds only while the page is visible, and focus/online events request an immediate refresh.

Pending local choices remain authoritative until a later GET returns the same state. This prevents eventually consistent KV reads from temporarily undoing a visible selection. The mocked-KV test covers one-time migration, zero repeat lists, batch normalization, role isolation, mutual intersection, legacy request compatibility, and invalid input.

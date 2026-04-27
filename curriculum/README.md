# Curriculum

Schema.org `Course` / `LearningResource` trees for TutorFin's three courses of study.

## Conventions

- One folder per course under `courses/<course-slug>/`:
  - `course.md` — the root `Course` entity.
  - `modules/NN-<slug>.md` — one `LearningResource` per module, ordered by the `NN` prefix and the `position` JSON-LD property.
- Each Markdown file contains:
  1. **YAML frontmatter** with authoring metadata (slug, title, status, owners, tags).
  2. A **JSON-LD `<script type="application/ld+json">` fenced code block** with the Schema.org payload.
  3. Human-readable Markdown body (objectives, scenarios, references).
- Hierarchy is expressed with `hasPart` (parent → children); children backlink with `isPartOf` using the parent's `@id`.
- Order is expressed with the `position` integer (1-based) on each `LearningResource`.
- Stable identifiers use the URN form `urn:tutorfin:course:<course-slug>` and `urn:tutorfin:module:<course-slug>:<module-slug>` so renames don't break links.

## Indexes

- `indexes/khan-academy.md` — Khan Academy lessons referenced by modules (name, url, topics).
- `indexes/common-core.md` — Common Core topic codes per subject.
- `indexes/topics.md` — flat list of topic labels per course of study.

Each module's JSON-LD references these via `teaches` (topic labels), `educationalAlignment` (Common Core codes), and `citation` (Khan Academy URLs).

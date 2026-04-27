# Curriculum

Schema.org `Course` / `LearningResource` trees for TutorFin's three courses of study.

## Conventions

- One folder per course under `courses/<course-slug>/`:
  - `course.md` — the root `Course` entity.
  - `modules/NN-<slug>.md` — one `LearningResource` per module, ordered by the `NN` prefix and the `position` JSON-LD property.
- Each module file is a **MyST Markdown Jupytext notebook** (`format_name: myst`) containing:
  1. **YAML frontmatter** with `jupytext` + `kernelspec` keys *and* a `tutorfin:` key holding authoring metadata (slug, title, position, status, tags).
  2. A hidden `{code-cell} python` (`:tags: [hide-input]`) that prints the Schema.org `LearningResource` payload as JSON-LD.
  3. Human-readable Markdown body (objectives, scenarios, references).
  4. **Exercises** with `{code-cell} python` blocks that end in `assert` statements as check figures.

  Convert any module to a runnable notebook with `jupytext --to notebook <path>`. See [../notebooks/README.md](../notebooks/README.md).
- Hierarchy is expressed with `hasPart` (parent → children); children backlink with `isPartOf` using the parent's `@id`.
- Order is expressed with the `position` integer (1-based) on each `LearningResource`.
- Stable identifiers use the URN form `urn:tutorfin:course:<course-slug>` and `urn:tutorfin:module:<course-slug>:<module-slug>` so renames don't break links.

## Indexes

- `indexes/khan-academy.md` — Khan Academy lessons referenced by modules (name, url, topics).
- `indexes/common-core.md` — Common Core topic codes per subject.
- `indexes/topics.md` — flat list of topic labels per course of study.

Each module's JSON-LD references these via `teaches` (topic labels), `educationalAlignment` (Common Core codes), and `citation` (Khan Academy URLs).

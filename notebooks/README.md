# Notebook authoring kit

TutorFin lessons live in MyST-formatted Markdown under
[curriculum/courses/](../curriculum/courses/). The `.md` files are the source
of truth, **and** they are valid Jupytext notebooks: the `jupytext` and
`kernelspec` keys in their YAML frontmatter let `jupytext` pair each `.md`
with an `.ipynb`.

## Workflow

```bash
# Install authoring deps
pip install -e ".[notebooks,test]"

# Convert one lesson .md -> .ipynb (next to the .md)
jupytext --to notebook curriculum/courses/personal-finance-100/modules/01-budgeting-and-saving.md

# Bulk convert every lesson
jupytext --to notebook curriculum/courses/*/modules/*.md

# Execute notebooks (runs the check-figure asserts)
jupytext --execute curriculum/courses/*/modules/*.md

# Run as pytest (asserts in cells become test failures)
pytest --nbmake curriculum/courses/*/modules/*.md   # if pytest-nbmake is installed
```

## Conventions

- **Source format**: MyST Markdown (`format_name: myst`). The `.md` stays the
  edited file. `.ipynb` is generated.
- **Kernel**: `python3` (display name `Python 3 (ipykernel)`).
- **Per-lesson metadata**: under the `tutorfin:` key in YAML frontmatter
  (`slug`, `title`, `position`, `status`, `tags`).
- **Schema.org JSON-LD**: each lesson opens with a hidden code cell
  (`:tags: [hide-input]`) that prints the `LearningResource` payload to JSON
  for downstream indexing.
- **Exercises**: each lesson has 2–3 exercises, each ending with one or more
  `assert` statements that act as **check figures**. A failing assert means a
  broken lesson.
- **LedgerText**: lessons that use plaintext accounting use Beancount syntax;
  see [docs/ledgertext-recommendation.md](../docs/ledgertext-recommendation.md).

## JupyterLite / Colab

The MyST → `.ipynb` output is plain Jupyter and runs in:

- **JupyterLite (xeus-python)** — install `beancount` via the
  `beancount-wasm` Pyodide wheel.
- **Google Colab** — `!pip install beancount jupytext` at the top of the
  generated notebook.

## Templates

- [template-lesson.md](template-lesson.md) — copy-paste starting point for a
  new lesson.

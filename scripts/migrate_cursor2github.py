#!/usr/bin/env python3
# PYTHON_ARGCOMPLETE_OK
import re
import argparse
from pathlib import Path

from typing import Union

try:
    import argcomplete  # type: ignore
except ImportError:
    argcomplete = None


def migrate_rules(base_dir: Union[str, Path]) -> None:
    """
    Migrate Cursor rules to GitHub Copilot instructions format.

    This script converts `.mdc` files in `.cursor/rules/` to Copilot's `.instructions.md` 
    format under `.github/instructions/`. It also updates the YAML frontmatter.
    
    Note: This script was originally written for viber3d, but may work for other projects.

    Args:
        base_dir: The base directory of the project containing the .cursor/rules/ directory.
    """
    base_path = Path(base_dir).resolve()
    cursor_dir = base_path / ".cursor" / "rules"
    github_dir = base_path / ".github" / "instructions"

    if not cursor_dir.exists():
        print(f"Directory {cursor_dir} does not exist.")
        return

    github_dir.mkdir(parents=True, exist_ok=True)

    for mdc_file in cursor_dir.rglob("*.mdc"):
        content = mdc_file.read_text("utf-8")

        # Parse frontmatter
        match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
        if not match:
            print(f"No frontmatter found in {mdc_file}, skipping frontmatter parsing.")
            new_content = content
        else:
            frontmatter, body = match.groups()
            lines = frontmatter.split("\n")
            new_lines = []

            for line in lines:
                line = line.strip()
                if not line:
                    continue
                if line.startswith("globs:"):
                    new_lines.append(line.replace("globs:", "applyTo:", 1))
                elif line.startswith("alwaysApply:"):
                    continue  # Remove this Copilot doesn't use it
                else:
                    new_lines.append(line)

            # Add a generated name based on the filename
            name = mdc_file.stem.replace("-", " ").title()
            if not any(line.startswith("name:") for line in new_lines):
                new_lines.insert(0, f'name: "{name}"')

            new_frontmatter = "\n".join(new_lines)
            new_content = f"---\n{new_frontmatter}\n---\n{body}"

        # Determine target path
        if mdc_file.name == "001-base.mdc":
            # Global rules apply to the entire workspace
            target_file = base_path / ".github" / "copilot-instructions.md"
            target_file.parent.mkdir(parents=True, exist_ok=True)
        else:
            rel_path = mdc_file.relative_to(cursor_dir)
            target_file = github_dir / rel_path.with_suffix(".instructions.md")
            target_file.parent.mkdir(parents=True, exist_ok=True)

        target_file.write_text(new_content, "utf-8")
        print(
            f"Migrated: {mdc_file.relative_to(base_path)} -> {target_file.relative_to(base_path)}"
        )


def main() -> None:
    """
    Main entry point for the migration script. Parses arguments and runs the migration.
    """
    parser = argparse.ArgumentParser(
        description="Migrate Cursor rules to GitHub Copilot instructions format. (Originally written for viber3d but may work for others)"
    )
    parser.add_argument(
        "base_dir",
        type=str,
        nargs="?",
        default=".",
        help="Base directory of the project containing the .cursor/rules/ directory",
    )

    # Enable argcomplete if it is installed
    if argcomplete:
        argcomplete.autocomplete(parser)

    args = parser.parse_args()
    migrate_rules(args.base_dir)


if __name__ == "__main__":
    main()

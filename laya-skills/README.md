# laya-skills/ — laya-only skills

Skills in this directory are usable **only by the laya agent**. Every other
agent is denied by the `skill` / `laya-*` deny rule the installer adds to the
config; the laya agent re-allows the skills selected at install time in its
own definition.

Conventions:

- One skill per directory: `laya-<id>/SKILL.md`.
- The skill ID must start with the `laya-` prefix.
- No extra config needed: the canonical repository is cloned into the global
  skills directory (`~/.config/opencode/skills/laya`), which OpenCode scans
  automatically.
- **Self-contained single files.** Laya has no filesystem access — it cannot
  read a `references/` subdirectory or any companion file. Everything the
  skill teaches must live inside its `SKILL.md`. (Shared skills under
  `skills/` may use `references/`, because normal agents can read files.)
- Every directory here must have exactly one entry in `manifest.jsonc` →
  `layaSkills`, and vice versa; the installer validates the sync and fails
  loudly on a mismatch.
- All content in English.

How installation works (see `manifest.jsonc` → `layaSkills`):

- `"install": "always"` — installed on every install, never asked (today
  only `laya-coltex`).
- `"install": "ask"` — the installer asks yes/no for each one and generates
  an explicit allow rule per selected skill in the agent file. A skill that
  stays on disk but was **not** selected remains invisible to laya.
- Adding a new skill later (directory + manifest entry, commit, push,
  `git pull` on the machines) makes it available to new installs. Existing
  installs only gain it by re-running the installer, which regenerates the
  agent's allow rules.

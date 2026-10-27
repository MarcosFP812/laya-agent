# skills/ — shared skills

Skills in this directory are visible to **every** OpenCode agent. The laya
agent does not see them unless a `todos`-scoped allow rule is added for them
in its definition (its own deny-all hides everything not explicitly
re-allowed).

Conventions:

- One skill per directory: `<skill-id>/SKILL.md`.
- The skill ID is the directory name and must **not** start with `laya-`
  (that prefix is reserved for `../laya-skills/`).
- No extra config needed: the canonical repository is cloned into the global
  skills directory (`~/.config/opencode/skills/laya`), which OpenCode scans
  automatically.

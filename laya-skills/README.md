# laya-skills/ — laya-only skills

Skills in this directory are usable **only by the laya agent**. Every other
agent is denied by the `skill` / `laya-*` deny rule the installer adds to the
config; laya re-allows the prefix in its own definition.

Conventions:

- One skill per directory: `laya-<id>/SKILL.md`.
- The skill ID must start with the `laya-` prefix.
- No extra config needed: the repository root is registered as a single
  skill source, and this directory is part of it.
- Put supporting assets in a `references/` subdirectory of the skill.

> **Note:** `laya-selftest/` is a temporary pipeline test — delete it after
> the first successful verification.

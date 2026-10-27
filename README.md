# laya

An OpenCode agent repository for our research group's LaTeX workflow.

**Laya** is a ColTex-only OpenCode agent: it talks to the group's ColTex
server (a collaborative LaTeX editor) through its MCP, and to nothing else.
This repository is also an [OpenCode skill](./laya/SKILL.md) — an installing
agent loads it and follows it to set everything up.

## What is in here

| Path | Purpose |
| --- | --- |
| [`laya/SKILL.md`](./laya/SKILL.md) | The installer skill (agent-facing; ID `laya`). Load it by ID (`@laya`) or read it directly and follow it |
| [`manifest.jsonc`](./manifest.jsonc) | Source of truth for MCP servers and skill groups + their visibility |
| [`laya/references/agent-template.md`](./laya/references/agent-template.md) | Template of the agent definition |
| [`laya/references/config-fragment.jsonc`](./laya/references/config-fragment.jsonc) | Annotated example of the config fragment the installer merges |
| [`laya/references/verification.md`](./laya/references/verification.md) | Post-restart verification checklist |
| [`laya/scripts/merge-config.mjs`](./laya/scripts/merge-config.mjs) | JSONC-tolerant merge/remove/verify for OpenCode configs (backup included) |
| [`laya/scripts/probe-mcp.mjs`](./laya/scripts/probe-mcp.mjs) | Functional probe of a ColTex MCP endpoint |
| [`laya-skills/`](./laya-skills/) | Skills **only** for the laya agent (IDs start with `laya-`) |
| [`skills/`](./skills/) | Skills for **every** agent (IDs must not start with `laya-`) |

## Quick start (for an agent)

```sh
git clone <this-repo>            # anywhere convenient
# inside an OpenCode session, then either:
#   - load the skill by ID after registering it, or
#   - simply read <repo>/laya/SKILL.md and follow it phase by phase
```

The installer will ask for:

1. the ColTex server base URL,
2. the bot's MCP token (`coltex_…`),
3. the install scope (this project, or global).

It then writes the agent file and the MCP config, verifies the setup, and
asks you to restart OpenCode. See [`laya/SKILL.md`](./laya/SKILL.md) for the
full contract.

## Registering the repository as a skill source

One config entry covers everything — the repo root itself:

```jsonc
{ "skills": ["<repo>"] }
```

From that single source OpenCode discovers:

| Skill | Found at | Visibility |
| --- | --- | --- |
| `laya` (installer) | `laya/SKILL.md` | every agent (it must be runnable before laya exists) |
| `laya-selftest` … | `laya-skills/<id>/SKILL.md` | denied for everyone except laya |
| shared skills | `skills/<id>/SKILL.md` | every agent |

This README has no frontmatter description, so it is never advertised as a
skill — it stays a human-only document.

## Security model

- **No secrets live in this repository.** The bot token is stored once, in
  `~/.config/opencode/laya-token`, and referenced from the config with
  `{file:...}` substitution. Safe to commit; safe to share.
- **Visibility is enforced by permissions**, not conventions alone:
  ColTex MCP tools (`coltex_*`) and `laya-*` skills are denied for every
  agent, and the `laya` agent's own rules re-allow them. Other agents never
  see them.
- The example URLs in this repo are placeholders. Ask the group for the real
  server address.

## Maintenance

Adding a skill is a single directory plus `SKILL.md` — no config change is
needed, because the repo root is already the one registered source. New MCP
servers require a `manifest.jsonc` entry plus one installer re-run.

> **Note:** `laya-skills/laya-selftest/` is a temporary pipeline test. Delete
> it after the first successful installation.

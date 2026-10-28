# laya

An OpenCode agent repository for our research group's LaTeX workflow.

**Laya** is a full OpenCode agent for the group's LaTeX workflow: it manages
the group's ColTex server (a collaborative LaTeX editor) through its MCP and
has the complete native OpenCode toolset for everything else. This
repository is also an [OpenCode skill](./laya/SKILL.md) — an installing
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
| [`laya-skills/`](./laya-skills/) | Skills **only** for the laya agent (IDs start with `laya-`; catalog and install mode in the manifest) |
| [`skills/`](./skills/) | Skills for **every** agent (IDs must not start with `laya-`) |

## Where the skills live

The canonical repository is `https://github.com/MarcosFP812/laya-agent`.
The installer clones it once into OpenCode's built-in global skills
directory:

```sh
git clone https://github.com/MarcosFP812/laya-agent ~/.config/opencode/skills/laya
```

From there OpenCode discovers everything automatically — no `skills` config
entry is needed in any project:

| Skill | Found at (inside the clone) | Visibility |
| --- | --- | --- |
| `laya` (installer) | `laya/SKILL.md` | every agent (it must be runnable before laya exists) |
| `laya-coltex`, `laya-paper-craft`, … | `laya-skills/<id>/SKILL.md` | denied for everyone except laya |
| shared skills | `skills/<id>/SKILL.md` | every agent |

Laya-only skills are selected at install time: the installer asks yes/no for
every optional skill and generates an explicit allow rule per selected skill
inside the agent file. A skill that stays on disk but was not selected
remains invisible to laya.

Updating skills on a machine is a `git -C ~/.config/opencode/skills/laya
pull`. This README has no frontmatter description, so it is never advertised
as a skill — it stays a human-only document.

## The laya skills

The agent's methodology lives in its skills (all self-contained single
`SKILL.md` files, in English). The catalog — descriptions and install mode —
is `manifest.jsonc` → `layaSkills`:

| Skill | Purpose | Install |
| --- | --- | --- |
| `laya-coltex` | Operating manual for the ColTex MCP: tool map, orientation/edit/compile/comment loops, change control, the group's paper architecture (R1–R12), integrity rules | always |
| `laya-paper-craft` | Draft/restructure sections with ML conventions; claims bound to evidence | ask |
| `laya-review` | Adversarial pre-submission review, severity-classified, LLM-eval pitfalls | ask |
| `laya-style` | De-slop polish that never touches numbers, claims or limitations | ask |
| `laya-citation-checks` | Bib hygiene + metadata verification against free APIs (Crossref/OpenAlex/arXiv) | ask |
| `laya-literature` | Related-work search and mapping via free APIs, with provenance | ask |
| `laya-figures` | Publication figures as pgfplots compiled by ColTex | ask |
| `laya-abstract` | Titles, abstracts and keywords within budgets, claims matching results | ask |
| `laya-reproducibility` | Reproducibility statements from user-provided facts only | ask |
| `laya-skill-craft` | Create new skills or improve existing ones in this repository's format: intent capture, drafting, baseline-compared test prompts, feedback iteration, description tuning | ask |

The skills' external data comes from free, key-less scholarly APIs
(Crossref, OpenAlex, arXiv, …) — that is the group's citation standard, not
a capability limit: laya is a full OpenCode agent (shell, filesystem, web,
subagents) like any other.

## What the installer touches in a project

Exactly two files, nothing else — and it cleans up after itself:

```text
<project>/.opencode/agents/laya.md    # the agent (from the template)
<project>/.opencode/opencode.jsonc    # MCP + permissions (merge, with backup)
```

No repository copies, no `manifest.jsonc`, no skills directories, no git
history changes in the target project. The token lives outside, in
`~/.config/opencode/laya-token`.

## Quick start (for an agent)

```sh
git clone https://github.com/MarcosFP812/laya-agent ~/.config/opencode/skills/laya
# inside an OpenCode session, then either:
#   - load the skill by ID (@laya), or
#   - read ~/.config/opencode/skills/laya/laya/SKILL.md and follow it
```

The installer will ask for:

1. the ColTex server base URL,
2. the bot's MCP token (`coltex_…`),
3. the install scope (this project, or global),
4. yes/no for each optional laya skill (one question per skill; the catalog
   and which skills are optional live in `manifest.jsonc` — the core
   `laya-coltex` skill is always installed and never asked).

On a machine where the global clone does not exist yet, either run the
`git clone` above yourself first, or include the canonical repository URL
in your install request — the installing agent then performs the bootstrap
itself (Phase 2.0 of the contract) before anything else. Without the clone
or the URL, an installing agent has no contract to follow and must stop.

It then writes the agent file and the MCP config, verifies the setup, cleans
up, and asks you to restart OpenCode. See
[`laya/SKILL.md`](./laya/SKILL.md) for the full contract.

## Security model

- **No secrets live in this repository.** The bot token is stored once, in
  `~/.config/opencode/laya-token`, and referenced from the config with
  `{file:...}` substitution. Safe to commit; safe to share.
- **Visibility is enforced by permissions**, not conventions alone:
  ColTex MCP tools (`coltex_*`) and `laya-*` skills are denied for every
  agent, and the `laya` agent's own rules re-allow them (per selected
  skill). Other agents never see them. The installer also writes a global
  `laya-*` skill deny, so the globally cloned laya-only skills stay hidden
  even in projects without a laya config.
- **Laya is a full agent**: it has the complete native OpenCode toolset
  (shell, filesystem, unrestricted webfetch/websearch, subagents). ColTex
  tools and `laya-*` skills remain exclusive to it via the config denies
  its own agent file re-allows (last matching rule wins).
- The example URLs in this repo are placeholders. Ask the group for the real
  server address.

## Maintenance

Adding a skill is a directory plus a self-contained `SKILL.md` in
`laya-skills/` **and** its `layaSkills` entry in `manifest.jsonc`; machines
pick it up with `git pull`, and existing installs gain it by re-running the
installer (which regenerates the agent's allow rules). New MCP servers
require a `manifest.jsonc` entry plus one installer re-run.

# Post-restart verification checklist

Run this in a **fresh OpenCode session** after the installer finishes. Every
check must pass; if one fails, see the troubleshooting table in `laya.md`.

## 1. MCP registered

- Run `opencode mcp list`.
- Expect: `coltex` listed as connected (not "needs authentication").

## 2. Laya works end-to-end

- Switch to the `laya` agent (agent selector in the TUI) and ask:
  "Lista mis proyectos de ColTex".
- Expect: a real answer produced by the `coltex_list_projects` tool (project
  names, or an honest "no hay proyectos compartidos conmigo todavía").

## 3. Isolation holds

- Switch to another agent (e.g. `build`) and ask for the ColTex projects.
- Expect: no `coltex_*` tool is available to it; it cannot comply.
- Cross-project check (optional): from a session in a project WITHOUT the
  laya config, the `laya-*` skills must not be advertised to any agent (the
  global `laya-*` deny guards this).

## 4. The laya-only skill mechanism works

- As the laya agent, load the `laya-selftest` skill and follow it.
- Expect: it calls `coltex_list_projects`, reports the result, and reminds
  you that the skill is temporary.

## 5. Cleanup

- Once checks 1–4 pass, delete `laya-skills/laya-selftest/` from the
  repository and commit the change.

## Optional CLI check

Outside the TUI:

    opencode run --agent laya "Lista mis proyectos de ColTex"

(If `--agent` is not supported by your build, verify through the TUI only.)

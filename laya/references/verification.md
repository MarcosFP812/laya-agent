# Post-restart verification checklist

Run this in a **fresh OpenCode session** after the installer finishes. Every
check must pass; if one fails, see the troubleshooting table in
`laya/SKILL.md`.

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

- As the laya agent, load the `laya-coltex` skill (it is always installed)
  and follow its orientation loop on a real project (list_projects →
  list_files → read the main document).
- Expect: the skill loads, the loop runs with real data, and laya can also
  see every other skill that was selected at install time.

## 5. Native toolset (full agent)

- As the laya agent, run a trivial shell command, e.g. ask
  "Ejecuta `echo ok` y dime qué devuelve".
- Expect: the shell tool runs and returns `ok`.
- Then ask for an arbitrary URL, e.g. "Descarga `https://example.com` con
  webfetch".
- Expect: the fetch proceeds normally — laya is a full OpenCode agent and
  its web access is not domain-scoped.

## Optional CLI check

Outside the TUI:

    opencode run --agent laya "Lista mis proyectos de ColTex"

(If `--agent` is not supported by your build, verify through the TUI only.)

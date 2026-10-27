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

## 5. Webfetch gate (free scholarly APIs)

- As the laya agent, fetch a real DOI record with `webfetch`, e.g.
  `https://api.crossref.org/works/10.1145/3442188.3445922`.
- Expect: HTTP 200 and JSON containing the paper's title.
- If the install used the manifest's domain-scoped rules, also confirm that
  a URL outside the allowlist (e.g. `https://example.com`) is **refused** —
  laya's web access is API-only by design.
- If the scoped rules do not work in your OpenCode build (the fetch is
  blocked despite the allow rule), see the troubleshooting table: fall back
  to a single unscoped `webfetch` allow and say so in the install report.

## Optional CLI check

Outside the TUI:

    opencode run --agent laya "Lista mis proyectos de ColTex"

(If `--agent` is not supported by your build, verify through the TUI only.)

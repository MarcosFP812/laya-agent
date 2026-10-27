---
name: Laya Self-Test
description: >-
  TEMPORARY pipeline test for the laya agent setup. Proves that laya-only
  skill loading works and that the ColTex MCP tools are reachable. Delete
  this skill after the first successful verification.
---

# Laya self-test (temporary)

You are running a pipeline test. Do exactly the following — nothing more:

1. Call `coltex_list_projects`.
2. Report, in Spanish:
   - how many projects were returned and their names (or an honest "todavía
     no tengo proyectos compartidos" if the list is empty);
   - the exact sentence: `laya-* skill loading works`.
3. Remind the user that this skill is temporary and should be deleted from
   the repository (`laya-skills/laya-selftest/`) once verified.

Do not create, edit, or delete anything through the MCP tools. This test is
read-only by design.

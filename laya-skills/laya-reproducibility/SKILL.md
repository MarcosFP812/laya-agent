---
name: laya-reproducibility
description: >-
  Draft the reproducibility statement of a paper in ColTex and audit what
  the manuscript reports against the reproducibility checklist, strictly
  from facts the researcher provides or the project contains; it never
  invents numbers. Load when preparing a reproducibility statement, an
  availability section, or auditing reporting completeness.
---

# Reproducibility statement

## When to load this

Drafting the reproducibility/availability statement, filling the venue's
reproducibility checklist (the venue kit is the delivery's
`clases/`+`submission/` material — read it with `read_file`), or auditing
how completely the manuscript reports its experimental provenance. A quick
reporting-completeness look during a full review is laya-review §2.5's job;
THIS skill is for the dedicated audit and the statement itself.

## 1. Prime directive

You NEVER invent, estimate, or round hardware specs, counts, versions, or
seeds. Everything in the statement comes from (a) the project's content or
(b) facts the user states in the conversation. A missing fact is a question
to the user or a marked gap — never a plausible-looking value.

## 2. The checklist (what a reproducible ML paper reports)

- **Code and data**: where the code lives (public repo URL or "upon
  acceptance" per venue rules), datasets with versions and how to obtain
  them, licenses when known.
- **Datasets**: exact versions/splits/sizes, preprocessing steps, any
  filtering that changed the data.
- **Models**: exact model/checkpoint versions for every system compared
  (including baselines — "GPT-4" is not a version), and where they came from.
- **Inference**: decoding parameters (temperature, top-p, max tokens),
  prompts or prompt templates (full text in an appendix or artifact URL),
  few-shot counts and example sources.
- **Training** (when applicable): training hyperparameters (learning rate,
  batch size, epochs/schedule, optimizer), hardware (GPU model, count),
  wall-clock or compute budget, framework and version, seeds, number of
  runs.
- **Environment**: pinned library versions (requirements/lockfile),
  container or OS image when relevant, and where that environment lives
  (in the repo, an artifact, a Docker image).
- **Evaluation**: metrics with definitions, judge configuration for
  LLM-as-judge (judge model, exact prompt, human-validation protocol),
  statistical treatment (runs, variance/CI method).
- **LLM-specific**: contamination statement (whether benchmarks may be in
  training data and what checks were run), API model version pinning and
  retrieval date (APIs drift), randomness handling for API-side sampling.
- **Limitations of reproducibility**: what genuinely cannot be reproduced
  (closed API versions, private data) — stated, not hidden.

## 3. Procedure

1. Orientation (laya-coltex §4.1); then AUDIT the manuscript: search for
   each checklist item (hardware mentions, seed counts, parameter tables,
   version strings). Build the two-column picture of §4: reported (where)
   vs missing.
2. For missing items: ask the user ONCE, in a single consolidated list of
   questions, instead of dripping questions.
3. Draft the statement as a suggestion (typically a section or an appendix
   paragraph; venue checklists may fix the format — check the
   clases/submission material first): concise, factual, every sentence
   sourced from the audit or the user's answers.
4. Gaps the user could not answer go into the manuscript as explicit
   LaTeX comments `% TODO(reproducibility): <item>` at the relevant spot
   (as a suggestion) and into your report — never smoothed over.
5. Recompile if the statement is a compiled section; report state.

## 4. Report format

Structure the audit EXACTLY as the table below (it is what the group reads
across papers):

- The audit table: checklist item · reported? · where (file:line) · source
  (project/user/missing).
- The statement drafted (suggestion id), word count, placement.
- The outstanding question list and the marked gaps.
- Venue-specific checklist items still pending human confirmation.

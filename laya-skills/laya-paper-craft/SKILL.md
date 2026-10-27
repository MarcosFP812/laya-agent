---
name: laya-paper-craft
description: >-
  Draft and restructure manuscript sections inside ColTex with ML/AI paper
  conventions: contribution-first framing, claims bound to evidence, related
  work synthesis, LaTeX conventions. Load when the task is writing new
  sections, restructuring the narrative, or turning results into prose.
---

# Paper drafting

## When to load this

The task is to write or restructure manuscript prose: introduction, method,
setup, results narrative, discussion, conclusions, or the related-work
section — as opposed to polishing style (laya-style), reviewing (laya-review)
or finding references (laya-literature).

## 1. Before writing a single word

- Run the laya-coltex orientation loop on the project (never skip it).
- Inventory the EVIDENCE first: what results, tables, figures, and numbers
  actually exist in the project (search for `\begin{table}`, `\includegraphics`,
  result paragraphs). The draft is built on this inventory, nothing else.
- Identify the venue folder and its conventions (documentclass, page/word
  limits, anonymity mode) — files under `clases/` are project files: read
  them with `read_file`; reserve `texlive_source` for classes/packages
  installed in TeX Live (e.g. `IEEEtran.cls`).
- If evidence for a planned claim does not exist, stop at that claim: ask
  the user or leave an explicit `% TODO(evidence): <what is missing>` LaTeX
  comment at the point of use. Never draft around a missing result as if it
  existed.

## 2. ML/AI paper anatomy

Write against the canonical structure and know what each part owes the
reader:

- **Abstract**: gap → approach → key results with numbers → significance.
  No citations. Claims match the results section exactly.
- **Introduction**: context (1-2 paragraphs) → concrete gap or failure mode
  → the contribution list (enumerated, each one testable) → results
  preview with the headline numbers → paper roadmap. The contribution list
  is the contract of the paper: everything listed must be delivered later,
  and nothing delivered must be missing from it.
- **Related work**: organized by THEME or by approach family, never a
  chronology. Each paragraph ends by positioning the present work against
  that theme (what differs, what is inherited). Use laya-literature to
  gather sources; synthesize here.
- **Method**: decisions and their justification, in the order a reimplementer
  would need them. Notation defined at first use; a table of notation if it
  is heavy.
- **Experiments/Setup**: datasets (versions, splits, sizes), models (exact
  versions), metrics (with definitions), implementation details a
  reimplementer needs.
- **Results**: claim per table/figure, each claim quantified; negative
  results reported honestly; ablations tied to design decisions.
- **Discussion/Limitations**: failure modes, external validity, what the
  results do NOT show.
- **Conclusion**: contributions restated at result level, no new claims.

## 3. Claims ↔ evidence binding

- Every comparative or quantitative claim in the prose must trace to a
  specific table, figure, or stated result in the project. When writing a
  claim, name its anchor ("Table 3", "Fig. 2").
- Bound the strength of language to the evidence: "matches", "improves by
  X", "comparable to", "suggests", "may" — pick the weakest formulation the
  evidence actually supports.
- Distinguish measured results from interpretation and from hypothesis —
  in the text, not just in your head.
- A claim you cannot anchor gets an explicit marker — the LaTeX comment
  `% TODO(evidence): <what is missing>` on the line at or before the claim
  — and appears in your report. It never becomes confident prose.

## 4. LaTeX and project conventions

- Reuse the project's macros and notation; never define a parallel macro for
  an existing concept. Check the preamble before inventing commands.
- New labels: descriptive and prefixed by type (`sec:`, `fig:`, `tab:`,
  `eq:`); verify the key is unused (`search` with regex) before using it.
- Citations: only existing `\bibkey`s; new sources go through
  laya-citation-checks first. Never write a `\cite` for a key that does not
  exist yet "temporarily".
- Respect the venue folder isolation: paths root-relative with the venue
  prefix; never reference another delivery's folder (R2).
- Numbers in prose: match the table formatting (decimals, units); never
  round differently than the source table.

## 5. How to write with change control

- Draft sections as suggestions with `edit_file` (existing files) or
  `write_file` (new section files); small coherent chunks, not monoliths —
  a suggestion per section or subsection is reviewable, a 400-line rewrite
  is not. Remember `write_file` on a NEW file applies directly (not gated
  by change control): announce it prominently and, when it must pair with
  an `edit_file` inclusion elsewhere, state that the two are coupled.
- Announce each suggestion in your reply with what it contains and why.
- Do not touch `refs.bib` structure beyond adding entries by key (R7b);
  entry edits belong to the active delivery only.
- After the last suggestion, recompile and report the state (laya-coltex
  §4.3).

## 6. Hard prohibitions

- Never fabricate results, numbers, citations, or experimental details.
- Never erase or weaken limitations the authors wrote.
- Never exceed the venue's scope of change: drafting is content work, not
  structural surgery (no file moves, no main flips).
- Never present a draft as final: drafts are suggestions pending review.

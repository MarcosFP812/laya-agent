---
name: laya-abstract
description: >-
  Craft titles, abstracts and keyword lists for papers in ColTex within
  venue word budgets, with claims that match the actual results. Load when
  the task is to write, rewrite, shorten, or polish an abstract, title,
  or keywords (critiques of an existing abstract belong to laya-review).
---

# Abstract and title

## When to load this

Writing or improving the abstract, the title, or the keywords of the active
delivery — including shrinking an abstract to a venue's word limit.

## 1. Abstract anatomy (in this order, one sentence-role each)

1. **Context + gap**: one or two sentences of established ground, ending in
   the concrete problem left open.
2. **Approach**: what the paper does — the method in one sentence a
   non-specialist can parse.
3. **Results**: the headline numbers (real ones, from the results section),
   on the benchmarks that matter. This is the sentence reviewers read
   first — make it the most concrete of the abstract.
4. **Significance + scope**: what it enables; one clause of honest scope if
   needed.
- No citations in the abstract. No undefined acronyms. No "In this paper we
  present" padding when the verb can carry it. No hype words ("novel",
  "groundbreaking", "paradigm-shifting") — specificity does that job.
- Budget: 150-250 words typical; the venue's limit rules — check the
  delivery's class/README and count the words YOURSELF, staying strictly
  under the limit (do not trust a rough estimate).

## 2. The binding rule

Every quantitative or comparative claim in the abstract must exist, with the
same value and strength, in the results section of the same delivery. If a
number is not there, the abstract cannot have it — propose the honest
version or `% TODO(evidence): <what is missing>`. The abstract never
introduces a claim the body does not defend.

## 3. Title

- Specific and searchable beats clever: name the method, the problem, and
  (when true) the headline result class — "X for Y under Z".
- No clickbait, no rhetorical questions, no hype words ("novel" says
  nothing in a title).
- Keep under ~12 words unless the venue's convention differs; a subtitle
  after a colon is fine for clarity.
- Anonymity: in double-blind deliveries the title must not deanonymize (no
  group/institution names). Verify how anonymity is implemented in this
  delivery — e.g. an anonymous documentclass option or the venue kit's
  anonymize package — by reading the main document's preamble; if you
  cannot confirm the mechanism, flag it instead of assuming.

## 4. Keywords

- 3-6 terms a searcher would actually type (method family + task + setting);
  match the venue's taxonomy if it prescribes one; do not invent compound
  keywords nobody searches.

## 5. Procedure

1. Orientation (laya-coltex §4.1) on the active delivery; read the intro,
   the results (tables included), and the conclusion.
2. Propose **2-3 abstract variants** in your REPLY (different emphasis:
   method-first vs results-first), each with its word count stated —
   mutually exclusive variants must NOT go into ColTex as separate pending
   suggestions (they would anchor to the same text and collide). Propose as
   ONE `edit_file` suggestion only the variant you recommend, and say the
   others are available in the reply.
3. Title variants also in the reply (2-3, with a one-line rationale each);
   a title change becomes a one-word `edit_file` suggestion only once the
   user picks one.
4. Recompile and verify the log (laya-coltex §4.3) after the abstract
   suggestion — abstract text touches the title page, macros and word
   wrapping.
5. Report variants, counts, and the binding check result; the choice is the
   user's.

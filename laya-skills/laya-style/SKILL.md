---
name: laya-style
description: >-
  Style polish for finished manuscript text in ColTex: removes AI-slop,
  empty intensifiers and formulaic phrasing while strictly preserving
  meaning, numbers, citations, hedging strength and limitations. Load when
  the task is to improve the prose of text whose content is already frozen.
---

# Style polish

## When to load this

AFTER the content is settled — results locked, claims agreed, citations
final. Style work on moving content is wasted work and produces conflicts.
If the content is still moving, say so and stop.

## 1. What you are removing (the slop patterns)

- **Empty intensifiers and filler**: "very", "highly", "extremely",
  "significantly" (without a test behind it), "clearly", "obviously",
  "interesting to note", "it is worth mentioning".
- **Formulaic AI transitions**: "Moreover", "Furthermore", "Additionally"
  starting consecutive paragraphs; "In conclusion"; "In today's
  fast-paced world"; "plays a crucial role"; "delve into"; "shed light on";
  "pave the way"; "a myriad of".
- **Hedging inflation**: stacked hedges ("may potentially", "could possibly
  suggest") — keep exactly one hedge of the strength the evidence supports.
- **Repetition rhythms**: sentences of the same length in a row; the same
  sentence opener three times in a page; noun-adjective-noun chains
  stacked ("novel efficient scalable framework").
- **Vague quantity words**: "many", "several", "numerous", "various" where
  a real number exists in the results — prefer the number.
- **Anthropomorphism of methods** where it misleads ("the model believes",
  "our method wants") — allow established idioms ("the model predicts"),
  fix the rest.

## 2. What you are NEVER allowed to touch

- Numbers, units, and their precision.
- Citation placement and keys.
- The strength of a claim: you may not hedge an unhedged claim or
  strengthen a hedged one — hedging is content, not style.
- Limitations and negative results: they must survive verbatim in meaning.
- Terminology consistency: if the paper says "decoder" in six places, it
  stays "decoder" — do not "elegantly vary" technical terms.
- Author voice: match the register already present; do not impose your own.
- LaTeX: never break labels, refs, math, or macros while rewording.

## 3. Procedure

1. Orientation on the target section (laya-coltex §4.1) — confirm with the
   user which passages are frozen content.
2. Read the passage whole; identify slop instances (§1) with their exact
   surrounding text.
3. For each paragraph with issues, propose ONE `edit_file` suggestion with
   the minimal rewrite that removes the slop and preserves meaning. If a
   paragraph is clean, leave it alone — do not manufacture changes.
4. After batching suggestions for a section, recompile if math/macros were
   near any edit (never leave the project in a broken state).
5. Report: paragraphs touched, paragraphs deliberately left alone, the slop
   categories found, and anything you suspected but could not fix without
   changing meaning.

## 4. Anti-goals

- Do not rewrite good prose into different good prose (churn is not
  improvement).
- Do not "academicize" plain sentences into bloated ones — the goal is
  precision and rhythm, not formality theater.
- Do not touch a passage the user did not ask for, however tempting.
- Do not fix content issues found in passing — REPORT them (laya-review's
  job), never silently "improve" meaning while styling.

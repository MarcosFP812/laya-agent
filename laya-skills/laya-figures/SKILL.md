---
name: laya-figures
description: >-
  Publication-quality scientific figures as TikZ/pgfplots code, compiled by
  ColTex: training curves, grouped bars for ablations, error bars,
  standardized styling. Load when the task is to create or fix paper figures
  with pgfplots from real data.
---

# Scientific figures with pgfplots

## When to load this

The task is to create, fix, or standardize a figure that can be written as
TikZ/pgfplots code and compiled inside the project. You do NOT execute
Python/MATLAB — the figure IS the pgfplots source, compiled by ColTex (the
generator script, if any, lives in the delivery per the group's rules; the
data you plot always comes from the user or the project, never invented).

## 1. Ground rules

- **Data provenance**: plot only numbers the user gave you or that exist in
  the project (tables, logs, text). If data is missing, ask — never
  synthesize points, smooth curves, or "representative" values.
- Write the figure as a file (`write_file` for a new `figs/<name>.tex` —
  applies directly; `edit_file` for changes to an existing figure file),
  make sure the preamble has pgfplots and that some `\input`/`\include`
  actually pulls the figure in (propose those as suggestions when needed —
  state clearly when a new-file write and an inclusion suggestion are
  coupled), then compile and read the log before reporting anything
  (laya-coltex §4.3).
- Respect the delivery folder: the figure file and its inclusion path are
  root-relative (`<venue>/figs/...`), never cross-delivery (R2).
- Check the preamble first: is `\usepackage{pgfplots}` (and
  `\pgfplotsset{compat=...}`) already there? Add it only if absent, as its
  own suggestion, and say so.

## 2. Figure recipes

- **Training/evaluation curves** (line plot):
  `\begin{axis}[xlabel={Steps}, ylabel={Accuracy (\%)}, legend pos=north west, grid=major]`
  with `\addplot coordinates {...}` or `\pgfplotstableread` for larger data;
  one `\addplot` per method; `mark repeat={N}` to declutter dense markers.
- **Grouped/uniform bars** (ablations, per-dataset accuracy):
  `ybar` axis style, `bar width` (an axis key — written without backslash:
  `bar width=8pt`), `symbolic x coords` or a `table` with
  `x expr`; `enlarge x limits` so bars do not touch the frame.
- **Error bars / confidence intervals**: `\addplot+ [error bars/.cd, y dir=both, y explicit]`
  with `(x, y) +- (0, err)` coordinates, or explicit `y explicit plus/minus`
  asymmetric intervals. A comparison without error bars on noisy metrics is
  a review finding — propose them (ask for the run-level data if absent).
- **Small multiples**: requires `\usepgfplotslibrary{groupplots}` in the
  preamble; then `\begin{groupplot}[group style={group size=2 by 2}]` —
  one shared legend above the group beats four in-plot legends.
- **Tables-as-figures**: keep them as `tabular` (searchable), not pgfplots.

## 3. Publication-standard styling (apply consistently)

- Units in axis labels: `Loss (nats)`, `Time (h)` — never bare names.
- Every axis label and legend readable at column width: `\small` or
  `\footnotesize` tick labels via `tick label style={font=\small}`.
- Legends label METHODS not series filenames; inside the axes when space
  allows (`legend pos`), not floating.
- Colorblind-safe palettes (blue/orange, or the project's established
  scheme — consistency ACROSS figures of the same paper outranks any
  personal taste); differentiate also by mark shape or line style, since
  some readers print grayscale.
- No chartjunk: no shadows, no 3D, no double axes unless unavoidable; log
  axes (`xmode=log`) declared explicitly when used.
- Match text-width figures vs column-width figures to the venue's real
  geometry (`\columnwidth`/`\textwidth` in the `axis` width options).
- `compat=1.18` (or the newest the project's TeX Live has — verify with
  `texlive_source` on `pgfplots` if unsure) in the shared preamble, once.

## 4. Compile-and-diagnose specifics for pgfplots

Common failures and bounded fixes:
- `Package pgfplots Warning: running with incompatible pgfplots version` →
  the `compat` key is MISSING — add `\pgfplotsset{compat=...}` (it is a
  warning and the plot still renders, but fix it for deterministic output).
  A compat value NEWER than the installed pgfplots is a hard ERROR — lower
  it to the installed level (check with `texlive_source`).
- `Could not read table file ...` → data file path not root-relative, or the
  file does not exist (list_files to confirm).
- `Missing $ inserted` near a label → unescaped `_` in tick/legend text
  (escape it as `\_`). Beware `%` separately: it comments out the REST of
  the line, silently truncating options.
- Empty/missing plots or `Runaway argument` in the axis → a syntax error
  inside `\addplot` options aborts that plot's parsing (e.g. a stray comma
  or an unbalanced bracket).
- Missing legend entries → `\addlegendentry` count mismatch with
  `\addplot` count (extra entries show as blanks).
- Overfull `\hbox` around the figure → width options exceeding the line;
  constrain to `\columnwidth`/`\textwidth`.

## 5. Deliverable

Per figure: the file written, where it is included from, the compile result
— verified in the log by the `**<rootfile>` marker and the
`(./figs/<name>.tex` processing line — the data source used, and anything
the user still owes (run-level data for error bars, the missing series).
Never mark a figure done without a successful compile of a page that
includes it.

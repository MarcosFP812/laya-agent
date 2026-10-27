---
name: laya-literature
description: >-
  Search and map related work using the free key-less scholarly APIs (arXiv,
  OpenAlex, Crossref): build comparison tables, thematic clusters and gap
  statements from real, verifiable sources, delivered into ColTex as
  suggestions with provenance. Load when the task is finding, mapping, or
  organizing related work.
---

# Literature search and mapping

## When to load this

Building or refreshing a related-work section, finding surveys or recent
work on a topic, positioning a paper against the state of the art, or
answering "who else does X and how does it compare". Uses only free,
key-less APIs via `webfetch`.

## 1. What you can and cannot reach (say this when relevant)

- **Reachable**: arXiv (full metadata + abstracts), Crossref and OpenAlex
  (metadata for essentially all indexed literature), Semantic Scholar
  (metadata, rate-limited fallback).
- **NOT reachable**: paywalled full texts, Scopus/Web of Science (paid),
  anything behind a login. You work with metadata and abstracts; never
  claim to have read a full text you could not fetch, and never summarize
  beyond what the abstract (or the user) provides.
- Only outbound data: the query strings themselves (titles, author names,
  keywords). Never send manuscript passages to any API.

## 2. Search strategy

Start narrow, widen only if needed; record every query you ran.

- **arXiv** (AI/ML-first source): `GET http://export.arxiv.org/api/query?search_query=...&max_results=20&sortBy=relevance`
  - Field syntax: `all:<terms>`, `ti:"exact phrase"`, `abs:<term>`,
    `cat:cs.CL` (or cs.LG, cs.CV...), combined with `AND`/`OR`/`ANDNOT`,
    e.g. `search_query=abs:"chain-of-thought" AND cat:cs.CL`.
  - Date filter: `submittedDate:[202301010000 TO 202612312359]`.
  - Response: Atom XML — `<entry>` with `<title>`, `<author>`s, `<published>`,
    `<summary>`, `<id>` (the arXiv id), `<link rel="related" type="application/pdf" href=...>`.
  - Paginate with `start=`; stop when relevance degrades, not when the
    budget runs out.
- **OpenAlex**: `GET https://api.openalex.org/works?search=<terms>&per-page=25`
  - Filters: `&filter=from_publication_date:2023-01-01,concepts.id:C...`;
    `sort=cited_by_count:desc` for influence-flavored views; response JSON
    with `results[].title`, `authorships`, `publication_year`, `doi`,
    `cited_by_count`, `abstract_inverted_index` (reconstruct the abstract by
    sorting its keys numerically and mapping to values — say when you do).
- **Crossref**: `GET https://api.crossref.org/works?query.bibliographic=<terms>&rows=10`
  — best for published (non-arXiv) venue papers; respects the polite pool
  if the user gave a contact email (append `&mailto=` at runtime, never
  hardcode emails).
- **Semantic Scholar** fallback (rate-limited, expect 429 — back off):
  `GET https://api.semanticscholar.org/graph/v1/paper/search?query=<terms>&fields=title,authors,year,abstract,externalIds,citationCount&limit=10`.

Triangulate: the same paper seen on two sources is a stronger signal; dedupe
by DOI/arXiv id/title-normalization.

## 3. From results to structure (the actual deliverable)

- **Comparison table**: one row per work — method (one line), benchmark(s),
  metric, headline result, key limitation. Into ColTex as a LaTeX table
  suggestion (booktabs if the project loads it), every cell traceable to a
  source's abstract or the user's input.
- **Thematic clusters**: group the works into 2-4 families of approach; one
  paragraph per family ending with how the present paper differs (this is
  the skeleton of a related-work section — hand it to laya-paper-craft for
  full drafting).
- **Gap statement**: what NO cluster does, grounded in the table (name the
  missing cells explicitly, e.g. "no work evaluates X under distribution
  shift") — the honest version, even if it makes the contribution smaller.
- **Provenance discipline**: every source carries its arXiv id/DOI/URL and
  access date. Sources enter the bib only through laya-citation-checks
  verification — suggest the verified `@entry` drafts with the `howpublished`
  or `eprint` fields filled from the API response, never from memory.

## 4. Honest limits

- Citation counts (OpenAlex/Semantic Scholar) are informational; do not put
  them in the manuscript.
- Abstracts can oversell; mark single-source, abstract-only claims as
  "per abstract" in the table when the claim is load-bearing.
- If coverage is thin (few hits), say the search space you covered (queries,
  filters, dates) rather than implying exhaustion.
- Recency: arXiv listings change daily — note the retrieval date.

#!/usr/bin/env node
// merge-config.mjs — merge/remove/verify keys in an OpenCode JSONC config
// file without losing unrelated content. Zero dependencies, Node >= 18.
//
// Usage:
//   node merge-config.mjs merge  --config <file> --fragment <json-file>
//   node merge-config.mjs remove --config <file> --fragment <json-file>
//   node merge-config.mjs verify --config <file>
//
// Merge semantics
//   - objects            deep-merged key by key
//   - "permissions"      merged by (action, resource) pair; fragment rules win
//   - "skills"           union of strings, first occurrence wins
//   - everything else    fragment value replaces the base value
// Remove semantics (inverse of merge; same fragment shape)
//   - mcp.servers.<name> entries present in the fragment are deleted
//   - permissions rules whose (action, resource) match a fragment rule
//   - skills entries whose string matches exactly
//
// Notes and limits
//   - Comments are understood on input but NOT preserved on output (the
//     script warns when it strips any).
//   - Trailing commas are not supported (target files are machine-written).
//   - A timestamped backup <file>.bak-<UTC-timestamp> is written before any
//     modification of an existing file.
//
// Exit codes: 0 ok · 1 usage · 2 parse error

import fs from 'node:fs'
import path from 'node:path'

const USAGE = `Usage:
  node merge-config.mjs merge  --config <file> --fragment <json-file>
  node merge-config.mjs remove --config <file> --fragment <json-file>
  node merge-config.mjs verify --config <file>`

function main() {
  const [cmd, ...rest] = process.argv.slice(2)
  if (!['merge', 'remove', 'verify'].includes(cmd)) fail(USAGE, 1)

  const opt = (flag) => {
    const i = rest.indexOf(flag)
    return i === -1 ? undefined : rest[i + 1]
  }
  const configPath = opt('--config')
  const fragmentPath = opt('--fragment')
  if (!configPath || (cmd !== 'verify' && !fragmentPath)) fail(USAGE, 1)

  let base = {}
  let baseHadComments = false
  if (fs.existsSync(configPath)) {
    ;({ obj: base, hadComments: baseHadComments } = parseJsonc(
      fs.readFileSync(configPath, 'utf8'),
      configPath,
    ))
  } else if (cmd === 'verify') {
    fail(`NOT FOUND: ${configPath}`, 2)
  }

  if (cmd === 'verify') {
    console.log(`OK: ${configPath} is valid JSON(C).`)
    summarize(base)
    return
  }

  const fragment = parseJsonc(fs.readFileSync(fragmentPath, 'utf8'), fragmentPath).obj
  const backup = backupFile(configPath)

  if (cmd === 'merge') {
    const { changed } = mergeInto(base, fragment)
    write(configPath, base)
    console.log(`OK: merged ${changed} change(s) into ${configPath}`)
  } else {
    const removed = removeFrom(base, fragment)
    write(configPath, base)
    console.log(`OK: removed ${removed} entry(ies) from ${configPath}`)
  }
  if (backup) console.log(`Backup: ${backup}`)
  if (baseHadComments) {
    console.log('NOTE: the original file contained comments; they were not preserved.')
  }
  summarize(base)
}

// ------------------------------------------------------------- JSONC parsing

// Strip // and /* */ comments while respecting string literals.
function stripJsonc(src) {
  let out = ''
  let i = 0
  let inStr = false
  let hadComments = false
  const n = src.length
  while (i < n) {
    const c = src[i]
    if (inStr) {
      out += c
      if (c === '\\') {
        out += src[i + 1] ?? ''
        i += 2
        continue
      }
      if (c === '"') inStr = false
      i++
      continue
    }
    if (c === '"') {
      inStr = true
      out += c
      i++
      continue
    }
    if (c === '/' && src[i + 1] === '/') {
      hadComments = true
      while (i < n && src[i] !== '\n') i++
      continue
    }
    if (c === '/' && src[i + 1] === '*') {
      hadComments = true
      i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++
      i += 2
      continue
    }
    out += c
    i++
  }
  return { json: out, hadComments }
}

function parseJsonc(src, label) {
  const { json, hadComments } = stripJsonc(src)
  try {
    return { obj: JSON.parse(json), hadComments }
  } catch (err) {
    fail(`PARSE ERROR in ${label}: ${err.message}`, 2)
  }
}

// -------------------------------------------------------------------- merge

function isObj(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

const ruleKey = (r) => JSON.stringify([r?.action, r?.resource])

function mergeInto(base, frag) {
  let changed = 0
  for (const [k, v] of Object.entries(frag)) {
    if (isObj(v) && isObj(base[k])) {
      changed += mergeInto(base[k], v).changed
    } else if (k === 'permissions' && Array.isArray(v) && (Array.isArray(base[k]) || base[k] === undefined)) {
      const map = new Map((base[k] ?? []).map((r) => [ruleKey(r), r]))
      for (const r of v) map.set(ruleKey(r), r) // fragment wins
      const next = [...map.values()]
      if (JSON.stringify(next) !== JSON.stringify(base[k] ?? null)) changed++
      base[k] = next
    } else if (k === 'skills' && Array.isArray(v) && (Array.isArray(base[k]) || base[k] === undefined)) {
      const next = [...new Set([...(base[k] ?? []).map(String), ...v.map(String)])]
      if (JSON.stringify(next) !== JSON.stringify(base[k] ?? null)) changed++
      base[k] = next
    } else {
      if (JSON.stringify(v) !== JSON.stringify(base[k])) changed++
      base[k] = v
    }
  }
  return { changed }
}

// -------------------------------------------------------------------- remove

function removeFrom(base, frag) {
  let removed = 0
  for (const [k, v] of Object.entries(frag)) {
    if (k === 'mcp' && isObj(v) && isObj(v.servers) && isObj(base[k]?.servers)) {
      for (const name of Object.keys(v.servers)) {
        if (base[k].servers[name] !== undefined) {
          delete base[k].servers[name]
          removed++
        }
      }
      if (Object.keys(base[k].servers).length === 0) delete base[k].servers
      if (isObj(base[k]) && Object.keys(base[k]).length === 0) delete base[k]
    } else if (k === 'permissions' && Array.isArray(v) && Array.isArray(base[k])) {
      const kill = new Set(v.map(ruleKey))
      const before = base[k].length
      base[k] = base[k].filter((r) => !kill.has(ruleKey(r)))
      removed += before - base[k].length
      if (base[k].length === 0) delete base[k]
    } else if (k === 'skills' && Array.isArray(v) && Array.isArray(base[k])) {
      const kill = new Set(v.map(String))
      const before = base[k].length
      base[k] = base[k].filter((s) => !kill.has(String(s)))
      removed += before - base[k].length
      if (base[k].length === 0) delete base[k]
    } else if (isObj(v) && isObj(base[k])) {
      removed += removeFrom(base[k], v)
    } else if (k in base) {
      delete base[k]
      removed++
    }
  }
  return removed
}

// --------------------------------------------------------------------- misc

function backupFile(p) {
  if (!fs.existsSync(p)) return null
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .replace('.', '-')
    .slice(0, 19)
  const bak = `${p}.bak-${stamp}`
  fs.copyFileSync(p, bak)
  return bak
}

function write(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n')
}

function summarize(cfg) {
  const servers = Object.keys(cfg.mcp?.servers ?? {})
  console.log(
    `Config summary: mcp servers: [${servers.join(', ') || 'none'}], ` +
      `permissions: ${cfg.permissions?.length ?? 0} rule(s), ` +
      `skills: ${cfg.skills?.length ?? 0} source(s)`,
  )
}

function fail(message, code) {
  console.error(message)
  process.exit(code)
}

// Called last so every helper declaration is evaluated first (no TDZ).
main()

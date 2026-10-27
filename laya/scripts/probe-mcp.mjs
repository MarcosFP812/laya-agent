#!/usr/bin/env node
// probe-mcp.mjs — functional probe of a ColTex MCP endpoint.
//
// Usage:
//   node probe-mcp.mjs <mcp-url> <token>
//
// Sends a JSON-RPC tools/list request with the token as a Bearer header and
// prints the visible tool names on success. Installers use it to validate
// URL + token WITHOUT needing an OpenCode restart.
//
// Exit codes: 0 ok · 1 usage · 2 auth rejected (401/403) · 3 unreachable ·
//             4 unexpected response

const [url, token] = process.argv.slice(2)

if (!url || !token) {
  console.error('Usage: node probe-mcp.mjs <mcp-url> <token>')
  process.exit(1)
}
if (!token.startsWith('coltex_')) {
  console.error('BAD TOKEN FORMAT: expected a token starting with "coltex_"')
  process.exit(1)
}

let origin
try {
  origin = new URL(url).origin
} catch {
  console.error(`BAD URL: ${url}`)
  process.exit(1)
}

try {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
      origin,
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
  })

  if (res.status === 401 || res.status === 403) {
    console.error(`AUTH REJECTED: HTTP ${res.status} — the server refused this token.`)
    process.exit(2)
  }
  if (!res.ok) {
    console.error(`UNEXPECTED HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`)
    process.exit(4)
  }

  const contentType = res.headers.get('content-type') ?? ''
  let payload
  if (contentType.includes('text/event-stream')) {
    const text = await res.text()
    const dataLine = text
      .split('\n')
      .reverse()
      .find((l) => l.startsWith('data:'))
    payload = JSON.parse(dataLine.slice(5).trim())
  } else {
    payload = await res.json()
  }

  if (payload?.error) {
    console.error(`RPC ERROR ${payload.error.code ?? ''}: ${payload.error.message ?? 'unknown'}`)
    process.exit(4)
  }

  const tools = payload?.result?.tools
  if (!Array.isArray(tools)) {
    console.error(`UNEXPECTED RESPONSE: no tools array. ${JSON.stringify(payload).slice(0, 300)}`)
    process.exit(4)
  }

  console.log(`OK: ${tools.length} tool(s) visible at ${url}`)
  for (const t of tools) console.log(`  - ${t.name}`)
  process.exit(0)
} catch (err) {
  console.error(`UNREACHABLE: ${err?.cause?.code ?? err?.message ?? err}`)
  process.exit(3)
}

// Goedkeuringspoort (L11). Elke externe schrijfactie via een koppeling wacht op een klik van Sam.
// PreToolUse-hook: exit 2 = geblokkeerd. Zet de actie in memory/wachtrij.jsonl met een id.
// Sam keurt goed met:  node .claude/hooks/gate.mjs --keur <id>
// Noodstop (alleen lezen):  node .claude/hooks/gate.mjs --noodstop   (opheffen: --hervat)
import { createHash } from 'node:crypto'
import { appendFileSync, existsSync, readFileSync, writeFileSync, unlinkSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const KOPPELINGEN = /^mcp__(Gmail|Google_Calendar|Google_Drive|Notion|Zapier|Brevo|Canva|Figma|Base44|Cloudflare_Developer_Platform|Claude_Code_Remote|Claude_Docs)__/
// Alleen deze werkwoorden zijn lezen. Alles anders onder een koppeling is schrijven (fail closed).
const LEZEN = /^(search|list|get|read|fetch|query|download|describe|whoami|check|inspect|discover)/i

export const idVan = (tool, invoer) =>
  createHash('sha256').update(tool + '\n' + JSON.stringify(sorteer(invoer ?? {}))).digest('hex').slice(0, 16)

function sorteer(v) {
  if (Array.isArray(v)) return v.map(sorteer)
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map(k => [k, sorteer(v[k])]))
  return v
}

export function isSchrijven(tool) {
  if (!KOPPELINGEN.test(tool)) return false
  return !LEZEN.test(tool.replace(KOPPELINGEN, '').replace(/^[a-z]+-/, ''))
}

// toestand = { noodstop: boolean, goedgekeurd: Set<string> }
export function beslis(tool, invoer, toestand) {
  if (!isSchrijven(tool)) return { toegestaan: true }
  const id = idVan(tool, invoer)
  if (toestand.noodstop) return { toegestaan: false, id, reden: 'NOODSTOP staat aan: alleen lezen.' }
  if (toestand.goedgekeurd.has(id)) return { toegestaan: true, id }
  return { toegestaan: false, id, reden: 'Wacht op goedkeuring van Sam.' }
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const MEM = process.env.NOORDSTER_MEM || join(ROOT, 'memory')
const P = { nood: join(MEM, 'NOODSTOP'), keur: join(MEM, 'goedkeuringen.json'), wacht: join(MEM, 'wachtrij.jsonl') }

export function leesToestand(p = P) {
  let ids = []
  try { ids = JSON.parse(readFileSync(p.keur, 'utf8')).map(x => x.id) } catch { /* geen bestand = niets goedgekeurd */ }
  return { noodstop: existsSync(p.nood), goedgekeurd: new Set(ids) }
}

function cli(arg, id) {
  mkdirSync(MEM, { recursive: true })
  if (arg === '--noodstop') { writeFileSync(P.nood, new Date().toISOString() + '\n'); console.log('NOODSTOP aan.'); return }
  if (arg === '--hervat') { if (existsSync(P.nood)) unlinkSync(P.nood); console.log('NOODSTOP uit.'); return }
  if (arg === '--keur' && /^[0-9a-f]{16}$/.test(id || '')) {
    let l = []
    try { l = JSON.parse(readFileSync(P.keur, 'utf8')) } catch { /* nieuw */ }
    l.push({ id, op: new Date().toISOString() })
    writeFileSync(P.keur, JSON.stringify(l, null, 1) + '\n'); console.log('Goedgekeurd: ' + id); return
  }
  console.error('Gebruik: --noodstop | --hervat | --keur <id>'); process.exit(1)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv[2]) cli(process.argv[2], process.argv[3])
  else {
    let s = ''
    process.stdin.on('data', d => (s += d)).on('end', () => {
      let inv
      try { inv = JSON.parse(s) } catch { console.error('Poort: ongeldige invoer, geblokkeerd.'); process.exit(2) }
      const b = beslis(String(inv.tool_name || ''), inv.tool_input, leesToestand())
      if (b.toegestaan) process.exit(0)
      mkdirSync(MEM, { recursive: true })
      appendFileSync(P.wacht, JSON.stringify({ t: new Date().toISOString(), id: b.id, tool: inv.tool_name, invoer: inv.tool_input }) + '\n')
      console.error(`${b.reden} Actie ${inv.tool_name}, id ${b.id}. Goedkeuren: node .claude/hooks/gate.mjs --keur ${b.id}`)
      process.exit(2)
    })
  }
}

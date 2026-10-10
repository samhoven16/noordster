import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const VELDEN = ['id', 'waarde', 'eenheid', 'geldig_jaar', 'bron_url', 'geverifieerd_op', 'status', 'opmerking']

// Geeft een lijst problemen terug. Leeg = in orde. Ernst 'fout' laat de check falen, 'vlag' is zichtbaar maar niet fataal.
export function controleer(register, jaar) {
  const p = []
  const lijst = register && Array.isArray(register.constanten) ? register.constanten : null
  if (!lijst || !lijst.length) return [{ ernst: 'fout', id: '-', tekst: 'register leeg of ongeldig' }]
  const gezien = new Set()
  for (const c of lijst) {
    const id = c && c.id ? c.id : '?'
    const fout = tekst => p.push({ ernst: 'fout', id, tekst })
    for (const v of VELDEN) if (!(v in c)) fout(`veld ${v} ontbreekt`)
    if (gezien.has(id)) fout('dubbele id')
    gezien.add(id)
    if (typeof c.waarde !== 'number' || !Number.isFinite(c.waarde)) fout('waarde is geen getal')
    if (!/^https:\/\//.test(String(c.bron_url || ''))) fout('bron_url ontbreekt of is geen https-link')
    if (c.geldig_jaar !== null && !Number.isInteger(c.geldig_jaar)) fout('geldig_jaar moet een jaartal of null zijn')
    if (c.status !== 'bevestigd' && c.status !== 'ongecontroleerd') fout('status moet bevestigd of ongecontroleerd zijn')
    if (c.status === 'bevestigd' && !/^\d{4}-\d{2}-\d{2}$/.test(String(c.geverifieerd_op || ''))) fout('bevestigd zonder geverifieerd_op')
    if (Number.isInteger(c.geldig_jaar) && c.geldig_jaar < jaar) fout(`verlopen: geldig tot ${c.geldig_jaar}, het is ${jaar}`)
    if (c.status === 'ongecontroleerd') p.push({ ernst: 'vlag', id, tekst: 'nog niet bij de bron bevestigd' })
  }
  return p
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const pad = new URL('../memory/constanten.json', import.meta.url)
  const res = controleer(JSON.parse(readFileSync(pad, 'utf8')), new Date().getFullYear())
  for (const r of res) console.log(`${r.ernst === 'fout' ? 'FOUT' : 'vlag'}  ${r.id}: ${r.tekst}`)
  process.exit(res.some(r => r.ernst === 'fout') ? 1 : 0)
}

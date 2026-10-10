// Hevy: alleen lezen. De sleutel komt uit HEVY_API_KEY (omgeving), nooit uit een bestand, prompt of log.
// Schrijven (routines aanpassen) bestaat hier bewust niet: een schemawijziging loopt als voorstel via de poort.
import { fileURLToPath } from 'node:url'

const BASIS = 'https://api.hevyapp.com'
const PAD_OK = /^\/v1\/(user\/info|workouts(\/count)?|routines|routine_folders|exercise_templates|exercise_history\/[\w-]+)$/
const MAX_PAGINAS = 30 // L9: een cap op alles wat kan groeien

export function maakClient({ sleutel, fetchFn = globalThis.fetch, basis = BASIS } = {}) {
  if (!sleutel) throw new Error('HEVY_API_KEY ontbreekt (zet hem als omgevingsvariabele, niet in de chat)')
  // Enige uitgang naar Hevy (L11): alleen GET, alleen toegestane paden, sleutel nooit in een foutmelding.
  async function lees(pad, params = {}) {
    if (!PAD_OK.test(pad)) throw new Error(`Hevy-pad niet toegestaan: ${pad}`)
    const url = new URL(basis + pad)
    for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, String(v))
    const res = await fetchFn(url, { method: 'GET', headers: { 'api-key': sleutel, accept: 'application/json' } })
    if (!res.ok) throw new Error(`Hevy ${pad} gaf status ${res.status}`)
    return res.json()
  }
  // Nieuwste eerst. Stopt zodra een training ouder is dan `sinds` (ISO-datum) of bij de cap.
  async function workouts({ sinds } = {}) {
    const uit = []
    for (let page = 1; page <= MAX_PAGINAS; page++) {
      const r = await lees('/v1/workouts', { page, pageSize: 10 })
      for (const w of r.workouts || []) {
        if (sinds && String(w.start_time).slice(0, 10) < sinds) return uit
        uit.push(w)
      }
      if (page >= (r.page_count || 1)) break
    }
    return uit
  }
  return { lees, workouts, gebruiker: () => lees('/v1/user/info'), aantal: () => lees('/v1/workouts/count') }
}

const dag = iso => String(iso).slice(0, 10)
const MS_DAG = 86400000
const rond1 = n => Math.round(n * 10) / 10
const e1rm = (kg, reps) => rond1(kg * (1 + reps / 30)) // Epley

function werkSets(ex) {
  return (ex.sets || []).filter(s => s.type !== 'warmup' && s.weight_kg > 0 && s.reps > 0)
}

// Zuivere analyse: geen netwerk, geen klok. `nu` is een Date.
export function samenvatting(trainingen, nu) {
  const weken = [0, 0, 0, 0] // sessies, laatste 4 weken; index 0 = afgelopen 7 dagen
  const volume = [0, 0, 0, 0]
  const perOefening = new Map()
  let laatste = null
  for (const w of [...trainingen].sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)))) {
    const dagen = Math.floor((nu - new Date(w.start_time)) / MS_DAG)
    if (dagen < 0) continue
    laatste = dag(w.start_time)
    const wk = Math.floor(dagen / 7)
    if (wk < 4) weken[wk]++
    for (const ex of w.exercises || []) {
      const sets = werkSets(ex)
      if (!sets.length) continue
      if (wk < 4) volume[wk] += sets.reduce((t, s) => t + s.weight_kg * s.reps, 0)
      const lijst = perOefening.get(ex.title) || []
      lijst.push({ datum: dag(w.start_time), e1rm: Math.max(...sets.map(s => e1rm(s.weight_kg, s.reps))) })
      perOefening.set(ex.title, lijst)
    }
  }
  const oefeningen = [...perOefening].map(([naam, l]) => {
    let trend = 'te weinig data' // minder dan 4 sessies zegt niets
    if (l.length >= 4) {
      const nieuw = Math.max(...l.slice(-3).map(x => x.e1rm))
      const oud = Math.max(...l.slice(0, -3).map(x => x.e1rm))
      trend = nieuw >= oud * 1.025 ? 'stijgt' : nieuw < oud ? 'daalt' : 'stagneert'
    }
    return { naam, sessies: l.length, laatste_e1rm_kg: l[l.length - 1].e1rm, beste_e1rm_kg: Math.max(...l.map(x => x.e1rm)), trend }
  }).sort((a, b) => b.sessies - a.sessies).slice(0, 12)
  return {
    bron: 'Hevy',
    gemaakt: nu.toISOString().slice(0, 10),
    sessies_per_week: weken, // [deze 7 dagen, 7-14 dagen terug, ...]
    volume_kg_per_week: volume.map(Math.round),
    dagen_sinds_laatste: laatste ? Math.floor((nu - new Date(laatste)) / MS_DAG) : null,
    oefeningen,
  }
}

// Hevy vraagt geen verzoeken precies op xx:00. Bij minuut 0 wachten we een willekeurige 61-180 seconden.
export async function wachtBuitenUur(nu = new Date(), slaap = ms => new Promise(r => setTimeout(r, ms)), rnd = Math.random) {
  if (nu.getMinutes() !== 0) return 0
  const ms = (61 + Math.floor(rnd() * 120)) * 1000
  await slaap(ms)
  return ms
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const c = maakClient({ sleutel: process.env.HEVY_API_KEY })
    await wachtBuitenUur()
    const nu = new Date()
    const sinds = new Date(nu - 70 * MS_DAG).toISOString().slice(0, 10)
    console.log(JSON.stringify(samenvatting(await c.workouts({ sinds }), nu), null, 2))
  } catch (e) {
    console.error(String(e.message || e).replaceAll(process.env.HEVY_API_KEY || '\u0000', '***'))
    process.exit(1)
  }
}

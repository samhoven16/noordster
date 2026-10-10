// Testharnas voor de cockpit: laadt nexus/index.html in een headless browser met een nagebootste
// window.claude (db, sample, mcp). Dit bewijst opmaak en logica, niet de echte AI of de echte koppelingen.
import { readFileSync } from 'node:fs'

export const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')

export function seed(extra = {}) {
  const s = {}, now = Date.now(), today = new Date()
  for (let i = 0; i < 7; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i)
    s['dagen/' + iso(d)] = { datum: iso(d), energie: 5 + (i % 4), trainde: i % 2 === 0, kookte: i % 3 !== 0, leren: 1 + (i % 3) * 0.5, ondernemersuren: 4 + (i % 3), leven: i === 1 ? 'Padel met vrienden' : '', gedaan: i % 2 === 0 }
  }
  s['geld/g1'] = { datum: iso(today), soort: 'omzet', bedrag: 1850, categorie: 'testdata' }
  s['geld/g2'] = { datum: iso(today), soort: 'kosten', bedrag: 240, categorie: 'testdata' }
  s['config/doel'] = { bedrag: 10000, maat: 'omzet' }
  s['outreach/o1'] = { t: now - 3600e3, datum: iso(today), naam: 'Testbedrijf A', kanaal: 'bel', opvolg: iso(today), waarom: 'Kennismaking accountmanager buitendienst', status: 'open' }
  s['outreach/o2'] = { t: now - 7200e3, datum: iso(today), naam: 'Testbedrijf B', kanaal: 'mail', opvolg: iso(new Date(now + 3 * 864e5)), waarom: 'Opvolging na gesprek', status: 'open' }
  s['pipeline/p1'] = { t: now - 600e3, nonce: 'abcdef0123456789abcdef01', status: 'PENDING_HUMAN_AUTH', type: 'Agenda', opdracht: 'Agenda: Training sessie C · 11-10 15:00 tot 16:15', bron: 'chat', bronT: 0, datum: iso(today), direct: { tool: 'create_event', args: { summary: 'Training sessie C', startTime: '2026-10-11T15:00:00', endTime: '2026-10-11T16:15:00' } }, criticus: { oordeel: 'goed', reden: 'Eén afspraak in je eigen agenda, niemand uitgenodigd.', t: now - 500e3 } }
  s['pipeline/p2'] = { t: now - 5400e3, nonce: '0123456789abcdef01234567', status: 'AUTHORIZED', type: 'Overig', opdracht: 'Maak een boodschappenlijst', bron: 'chat', bronT: 0, datum: iso(today), dispatch: 'gestart' }
  s['briefing/' + iso(today)] = { datum: iso(today), t: now, hoofdactie: { tekst: 'Bel Testbedrijf A over de vacature', waarom: 'verlopen opvolging' }, leren: { track: 'vak', les: 'SPIN in drie regels', vraag: 'Wat is een implicatievraag?' }, opvolgen: [{ naam: 'Testbedrijf A', kanaal: 'bel', zeg: 'Goedemorgen, ik bel naar aanleiding van ...' }], menu_voorstel: [{ dag: 'ma', avond: 'Linzendal', waarom: 'goedkoop' }], lijst_voorstel: [{ t: 'linzen', afd: 'Droog en blik', prijs: '1,29', bron: 'testfolder' }], bron: 'Ochtend-run (testdata)' }
  s['bus/b1'] = { t: now - 1800e3, wie: 'Ochtend-run', sector: 'systeem', tekst: 'Briefing voor vandaag klaargezet (proefdata).' }
  s['chat/c1'] = { rol: 'user', tekst: 'Energie 7, getraind', t: now - 4000e3 }
  s['chat/c2'] = { rol: 'ai', tekst: 'Vastgelegd. Plan een eiwitrijke maaltijd na je training.', cluster: 'lichaam', ook: 'voeding', t: now - 3990e3, basis: 'energie laatste 7 dagen', ontvangsten: ['Dag 10-10: energie 7, trainde ja'], staf: 'Lichaam > Sportwetenschapper' }
  return { ...s, ...extra }
}

export function initScript(seedData) {
  return `(${function (SEED) {
    const store = new Map(Object.entries(SEED)), subs = []
    const clone = o => JSON.parse(JSON.stringify(o))
    const note = p => subs.forEach(s => s(p))
    const docsIn = col => { const o = []; for (const [p, d] of store) if (p.startsWith(col + '/') && !p.slice(col.length + 1).includes('/')) o.push({ id: p.slice(col.length + 1), data: () => clone(d), exists: true }); return o }
    const db = {
      collection(col) {
        let ord = null, lim = null
        const api = {
          orderBy(f, d) { ord = [f, d || 'asc']; return api }, limit(n) { lim = n; return api },
          onSnapshot(cb) {
            const run = () => { let docs = docsIn(col); if (ord) docs.sort((a, b) => { const x = a.data()[ord[0]], y = b.data()[ord[0]]; return (x > y ? 1 : x < y ? -1 : 0) * (ord[1] === 'desc' ? -1 : 1) }); if (lim) docs = docs.slice(0, lim); cb({ docs, empty: !docs.length }) }
            subs.push(p => { if (p.startsWith(col + '/')) run() }); setTimeout(run, 0); return () => {}
          },
          add(data) { const id = 'a' + Math.random().toString(36).slice(2, 8); store.set(col + '/' + id, clone(data)); note(col + '/' + id); return Promise.resolve({ id, delete: () => { store.delete(col + '/' + id); note(col + '/' + id); return Promise.resolve() } }) }
        }
        return api
      },
      doc(path) {
        return {
          set(d) { store.set(path, clone(d)); note(path); return Promise.resolve() },
          update(d) { store.set(path, Object.assign({}, store.get(path) || {}, clone(d))); note(path); return Promise.resolve() },
          delete() { store.delete(path); note(path); return Promise.resolve() },
          onSnapshot(cb) { const run = () => cb({ exists: store.has(path), data: () => clone(store.get(path)) }); subs.push(p => { if (p === path) run() }); setTimeout(run, 0); return () => {} }
        }
      }
    }
    window.__store = store; window.__calls = []; window.__prompts = []
    const sample = async () => ({ text: '{}' })
    sample.limits = async () => ({ images: null, tools: true })
    sample.json = async (input, opts) => {
      window.__opts = window.__opts || []; window.__opts.push(opts && opts.modelTier ? opts.modelTier : 'default')
      const arr = Array.isArray(input), first = arr ? input[0].content : String(input), last = arr ? input[input.length - 1].content : String(input)
      window.__calls.push(first.slice(0, 40)); window.__prompts.push(first)
      if (/Je bent de Criticus/.test(first)) return { oordeel: 'goed', reden: 'Past binnen de harde regels (testantwoord).' }
      if (/teamleider van Noordster/.test(first)) return { cluster: 'voeding', specialisten: [{ naam: 'Chef', taak: 'menu' }, { naam: 'Inkoper', taak: 'prijs' }] }
      if (/in het Noordster-team voor/.test(first)) return { advies: 'Testadvies van een specialist.', bezwaar: 'Prijzen zijn schattingen.', zeker: 0.7 }
      const code = /marktbeeld/i.test(last) ? 'Zoek het actuele marktbeeld op het web en vat het samen.' : null
      return { cluster: /trader|handel|marktbeeld/i.test(last + first.slice(0, 200)) ? 'fiscaal' : 'lichaam', ook: [], reply: 'Testantwoord op: ' + last.slice(0, 60), basis: 'testdata', kaart: null, actions: [], code, agenda: null, staf: [] }
    }
    const mcp = { callTool: async (s, t, a) => { window.__calls.push('mcp:' + s + '/' + t); return { payload: {} } } }
    window.claude = { use: async n => n === 'db' ? db : n === 'sample' ? sample : n === 'mcp' ? mcp : n === 'permissions' ? { request: async () => ({}), state: () => ({}) } : n === 'downloads' ? { save: async () => {} } : null }
  }})(${JSON.stringify(seedData)})`
}

export const html = () => readFileSync(new URL('../nexus/index.html', import.meta.url), 'utf8')

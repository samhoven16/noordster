// Maakt de voorbeeldversie van de cockpit: dezelfde pagina met een duidelijke VOORBEELD-balk en verzonnen gegevens.
// Gebruik: node scripts/demo.mjs <uitmap>   -> <uitmap>/demo.html en <uitmap>/docs/<collectie>/<id>.json en <uitmap>/writes.json
// Alles is verzonnen en gemarkeerd. Dit gaat in een APARTE artifact met een eigen lege database, nooit in de echte cockpit.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const hier = dirname(fileURLToPath(import.meta.url))
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
const dag = n => { const d = new Date(); d.setDate(d.getDate() + n); return d }

export function demoDocs(nu = new Date()) {
  const docs = {}, t = nu.getTime()
  for (let i = 0; i < 14; i++) {
    const d = dag(-i), train = [0, 2, 3, 5].includes(i % 7)
    docs['dagen/' + iso(d)] = { datum: iso(d), energie: 5 + ((i * 3) % 5), trainde: train, kookte: i % 7 !== 6 && i % 3 !== 0, leren: [0, 0.5, 1, 1.5][i % 4], ondernemersuren: [3, 5, 4, 6, 2][i % 5], leven: i % 6 === 1 ? 'Padel met vrienden (voorbeeld)' : i % 9 === 4 ? 'Etentje (voorbeeld)' : '', gedaan: i % 3 !== 2 }
  }
  const m = iso(nu).slice(0, 7)
  ;[['omzet', 1800, 'voorbeeld: klus A'], ['omzet', 1200, 'voorbeeld: klus B'], ['omzet', 1450, 'voorbeeld: klus C'], ['kosten', 210, 'voorbeeld: software'], ['kosten', 390, 'voorbeeld: reizen']].forEach((r, i) => {
    docs['geld/v' + i] = { datum: m + '-' + String(1 + i * 2).padStart(2, '0'), soort: r[0], bedrag: r[1], categorie: r[2], bron: 'voorbeeld' }
  })
  docs['config/doel'] = { bedrag: 10000, maat: 'omzet' }
  ;[[0, 14, 4, 2, 0], [1, 11, 3, 1, 0], [2, 9, 2, 1, 1]].forEach(([w, p, g, v, k]) => {
    const d = dag(-7 * w), y = d.getFullYear(), tmp = new Date(Date.UTC(y, d.getMonth(), d.getDate())), dn = tmp.getUTCDay() || 7
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dn); const j = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
    const id = tmp.getUTCFullYear() + '-W' + String(Math.ceil(((tmp - j) / 864e5 + 1) / 7)).padStart(2, '0')
    docs['pijplijn/' + id] = { prospects: p, gesprekken: g, voorstellen: v, klanten: k }
  })
  ;[['verkopen', 'Verkopen en onderhandelen', 3], ['aanbod', 'Aanbod en prijsstelling', 2], ['marketing', 'Marketing en leadgeneratie', 1], ['ai', 'AI en automatisering', 3], ['fiscaal', 'Financiën, belasting, boekhouden', 2], ['gedrag', 'Psychologie van gewoonten', 1], ['training', 'Training en herstel', 2], ['koken', 'Voeding en koken', 2], ['gitaar', 'Gitaar en muziek', 1], ['leren', 'Leren leren', 2]].forEach(([k, n, l]) => { docs['atlas/' + k] = { niveau: l, naam: n, bijgewerkt: iso(nu) } })
  ;[['Voorbeeldbedrijf A', 'bel', 0, 'Kennismaking accountmanager buitendienst'], ['Voorbeeldbedrijf B', 'mail', 1, 'Opvolging na gesprek'], ['Voorbeeldbedrijf C', 'mail', 3, 'Voorstel besproken'], ['Voorbeeldbedrijf D', 'bel', -1, 'Terugbellen over de functie']].forEach(([naam, kanaal, off, waarom], i) => {
    docs['outreach/o' + i] = { t: t - (i + 1) * 3600e3, datum: iso(nu), naam, kanaal, opvolg: iso(dag(off)), waarom, status: 'open' }
  })
  docs['pipeline/p1'] = { t: t - 600e3, nonce: 'abcdef0123456789abcdef01', status: 'PENDING_HUMAN_AUTH', type: 'Agenda', opdracht: 'Agenda: Training sessie C (voorbeeld)', bron: 'chat', bronT: 0, datum: iso(nu), direct: { tool: 'create_event', args: { summary: 'Training sessie C', startTime: iso(dag(1)) + 'T15:00:00', endTime: iso(dag(1)) + 'T16:15:00' } }, criticus: { oordeel: 'goed', reden: 'Past binnen de harde regels (voorbeeld).', t } }
  docs['briefing/' + iso(nu)] = { datum: iso(nu), t, hoofdactie: { tekst: 'Bel Voorbeeldbedrijf D over de functie', waarom: 'opvolging is een dag over tijd' }, leren: { track: 'vak', les: 'SPIN: stel eerst situatie- en probleemvragen, pas daarna implicatievragen.', vraag: 'Wat is een implicatievraag?' }, opvolgen: [{ naam: 'Voorbeeldbedrijf D', kanaal: 'bel', zeg: 'Goedemorgen, ik bel naar aanleiding van ons gesprek over de functie...' }], menu_voorstel: [{ dag: 'ma', ontbijt: 'Havermout met bessen', lunch: 'Linzensalade', avond: 'Linzendal met rijst', tussendoor: 'Noten', waarom: 'Goedkoop, eiwitrijk, restjes voor de lunch (voorbeeld).' }, { dag: 'di', ontbijt: 'Havermout met bessen', lunch: 'Restjes linzendal', avond: 'Kip met zoete aardappel', tussendoor: 'Yoghurt', waarom: 'Na krachttraining extra eiwit (voorbeeld).' }], lijst_voorstel: [{ t: 'Linzen', afd: 'Droog en blik', prijs: '' }, { t: 'Zoete aardappel', afd: 'Groente en fruit', prijs: '' }, { t: 'Kipfilet', afd: 'Vlees en vis', prijs: '' }], bron: 'voorbeeld' }
  ;['Briefing voor vandaag klaargezet (voorbeeld).', 'Opvolging van Voorbeeldbedrijf D staat open.', 'Hevy-stand bijgewerkt (voorbeeld).'].forEach((tekst, i) => { docs['bus/b' + i] = { t: t - (i + 1) * 900e3, wie: ['Ochtend-run', 'Avond-run', 'Week-run'][i], sector: ['systeem', 'inkomen', 'lichaam'][i], tekst } })
  docs['chat/c1'] = { rol: 'user', tekst: 'Energie 7, getraind (voorbeeld)', t: t - 4000e3 }
  docs['chat/c2'] = { rol: 'ai', tekst: 'Vastgelegd. Plan een eiwitrijke maaltijd na je training. (voorbeeldantwoord)', cluster: 'lichaam', ook: 'voeding', t: t - 3990e3, route: 'Snel · dag loggen', basis: 'voorbeeld', ontvangsten: ['Dag ' + iso(nu).slice(5) + ': energie 7, trainde ja'], staf: 'Lichaam > Sportwetenschapper' }
  docs['lichaam/hevy'] = { bron: 'voorbeeld', gemaakt: iso(nu), sessies_per_week: [3, 4, 3, 2], volume_kg_per_week: [9800, 11200, 9100, 7000], dagen_sinds_laatste: 1, oefeningen: [{ naam: 'Bankdrukken (voorbeeld)', sessies: 8, laatste_e1rm_kg: 78, beste_e1rm_kg: 82, trend: 'stagneert' }, { naam: 'Squat (voorbeeld)', sessies: 7, laatste_e1rm_kg: 112, beste_e1rm_kg: 112, trend: 'stijgt' }, { naam: 'Roeien (voorbeeld)', sessies: 6, laatste_e1rm_kg: 70, beste_e1rm_kg: 70, trend: 'stijgt' }] }
  docs['voeding/menu'] = { bijgewerkt: iso(nu), items: [{ dag: 'ma', avond: 'Linzendal met rijst (voorbeeld)', waarom: 'Goedkoop en eiwitrijk.' }, { dag: 'di', avond: 'Kip met zoete aardappel (voorbeeld)', waarom: '' }] }
  docs['voeding/boodschappen'] = { bijgewerkt: iso(nu), items: [{ t: 'Linzen', ok: false, afd: 'Droog en blik' }, { t: 'Zoete aardappel', ok: true, afd: 'Groente en fruit' }] }
  return docs
}

const BANNER = '<style>:root{padding-top:calc(22px + env(safe-area-inset-top,0px))!important}#demoBanner{position:fixed;top:0;left:0;right:0;height:22px;z-index:60;background:#ff7a6b;color:#1a0a07;font:700 11px/22px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;text-align:center;pointer-events:none;white-space:nowrap;overflow:hidden}</style><div id="demoBanner">Voorbeeld · alles verzonnen · niet jouw cockpit</div>\n'

export function demoHtml(bron) {
  const h = bron.replace('<title>Noordster Nexus</title>', '<title>Noordster Voorbeeld</title>')
  const i = h.indexOf('<div class="app" id="app"')
  if (i < 0) throw new Error('app-container niet gevonden')
  return h.slice(0, i) + BANNER + h.slice(i)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const uit = process.argv[2]
  if (!uit) { console.error('Geef een uitmap op'); process.exit(1) }
  mkdirSync(uit, { recursive: true })
  writeFileSync(join(uit, 'demo.html'), demoHtml(readFileSync(join(hier, '../nexus/index.html'), 'utf8')))
  const writes = []
  for (const [pad, data] of Object.entries(demoDocs())) {
    const [col, id] = pad.split('/'), f = join(uit, 'docs', col, id + '.json')
    mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(data))
    writes.push({ op: 'set', collection: col, doc_id: id, file_path: f })
  }
  writeFileSync(join(uit, 'writes.json'), JSON.stringify(writes))
  console.log(writes.length + ' documenten, ' + join(uit, 'demo.html'))
}

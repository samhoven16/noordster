// Gedragstests van de cockpit in een headless browser met een nagebootste runtime (zie cockpit-harness.mjs).
// Draait alleen als playwright-core en een Chromium beschikbaar zijn; anders worden ze overgeslagen.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { initScript, seed, html } from './cockpit-harness.mjs'

const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
let pw = null
try { pw = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core') } catch { /* niet beschikbaar */ }
const kan = !!pw && existsSync(CHROME)
const skip = kan ? false : 'playwright-core of Chromium ontbreekt'

const SKELETON = '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0}[hidden]:not([hidden=until-found i]){display:none!important}</style></head><body>'
let browser, file
before(async () => {
  if (!kan) return
  file = join(mkdtempSync(join(tmpdir(), 'cockpit-')), 'page.html')
  writeFileSync(file, SKELETON + html() + '</body></html>')
  browser = await (pw.chromium || pw.default.chromium).launch({ executablePath: CHROME, args: ['--no-sandbox'] })
})
after(async () => { if (browser) await browser.close() })

async function open(w = 1440, h = 900, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } })
  const page = await ctx.newPage(), errors = []
  page.on('pageerror', e => errors.push(e.message))
  await page.route('**/*', r => { const u = r.request().url(); return u.startsWith('file:') || u.startsWith('data:') ? r.continue() : r.abort() })
  await page.addInitScript(initScript(seed(extra)))
  await page.goto('file://' + file); await page.waitForTimeout(700)
  return { page, errors, ctx }
}

test('laadt zonder scriptfouten en zonder horizontale scroll (desktop en telefoon)', { skip }, async () => {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const { page, errors, ctx } = await open(w, h)
    assert.deepEqual(errors, [], 'pageerrors op ' + w)
    assert.equal(await page.evaluate(() => document.scrollingElement.scrollWidth - innerWidth), 0, 'overflow op ' + w)
    await ctx.close()
  }
})

test('zes sectoren, en elke sector heeft een team met een criticus', { skip }, async () => {
  const { page, ctx } = await open()
  assert.equal(await page.locator('#navList .ni').count(), 7) // Nexus + 6 sectoren
  for (let i = 2; i <= 7; i++) {
    await page.click(`#navList .ni:nth-child(${i})`)
    const rollen = await page.locator('#team .ag .rol').allTextContents()
    assert.ok(rollen.includes('Planner') || rollen.includes('Werker'))
    if (i !== 6) assert.ok(rollen.includes('Criticus'), 'sector ' + i + ' mist een criticus')
  }
  await ctx.close()
})

test('een werker kiezen zet de rol in de prompt; Trader krijgt de handelsgrenzen', { skip }, async () => {
  const { page, ctx } = await open()
  await page.click('#wList .wi >> text=Trader')
  await page.fill('#msg', 'Wat vind je van een idee?'); await page.click('#send'); await page.waitForTimeout(900)
  const prompts = await page.evaluate(() => window.__prompts)
  const main = prompts.find(p => /Je bent Noordster/.test(p))
  assert.match(main, /FOCUS: Sam praat nu rechtstreeks met Trader/)
  assert.match(main, /plaatst nooit orders/)
  assert.match(main, /geen risicolimiet|Heeft Sam geen risicolimiet/)
  await ctx.close()
})

test('zonder gekozen werker staat er geen FOCUS-regel in de prompt', { skip }, async () => {
  const { page, ctx } = await open()
  await page.fill('#msg', 'Hallo'); await page.click('#send'); await page.waitForTimeout(900)
  const main = (await page.evaluate(() => window.__prompts)).find(p => /Je bent Noordster/.test(p))
  assert.doesNotMatch(main, /FOCUS:/)
  await ctx.close()
})

test('poort: een externe taak doet niets zonder klik, en start pas na goedkeuren', { skip }, async () => {
  const { page, ctx } = await open()
  await page.click('#wList .wi >> text=Trader')
  await page.click('.quick .chip >> text=Haal het marktbeeld op'); await page.waitForTimeout(1200)
  assert.equal(await page.locator('#gate .gcard').count(), 2, 'de nieuwe taak staat als kaart klaar (naast de bestaande)')
  let calls = await page.evaluate(() => window.__calls)
  assert.ok(!calls.some(c => c.startsWith('mcp:')), 'er is niets uitgevoerd vóór de klik')
  await page.click('#gate .gcard >> nth=1 >> text=Goedkeuren'); await page.waitForTimeout(600)
  calls = await page.evaluate(() => window.__calls)
  assert.ok(calls.some(c => c.startsWith('mcp:Claude Code Remote/fire_trigger')), 'na goedkeuren start de werker')
  await ctx.close()
})

test('criticus legt een oordeel vast bij elke nieuwe externe taak', { skip }, async () => {
  const { page, ctx } = await open()
  await page.click('#wList .wi >> text=Trader')
  await page.click('.quick .chip >> text=Haal het marktbeeld op'); await page.waitForTimeout(1500)
  const docs = await page.evaluate(() => [...window.__store].filter(([p]) => p.startsWith('pipeline/')).map(([, d]) => d))
  assert.ok(docs.filter(d => d.criticus && d.criticus.oordeel).length >= 2)
  assert.match(await page.locator('#gate').innerText(), /Criticus/)
  await ctx.close()
})

test('constanten in de cockpit zijn gelijk aan memory/constanten.json (L3)', { skip }, async () => {
  const reg = JSON.parse(readFileSync(new URL('../memory/constanten.json', import.meta.url), 'utf8'))
  const m = html().match(/\/\*CONSTANTEN-START\*\/([\s\S]*?)\/\*CONSTANTEN-END\*\//)
  assert.deepEqual(JSON.parse(m[1]), reg)
})

test('de live-stroom toont alleen echte gebeurtenissen uit de database', { skip }, async () => {
  const { page, ctx } = await open()
  const tekst = await page.locator('#stream').innerText()
  assert.match(tekst, /Ochtend-run/) // uit de bus-collectie van de seed
  assert.match(tekst, /Poort/)
  await ctx.close()
})

test('mobiel: tabs wisselen tussen sectoren, kamer, chat, poort en live', { skip }, async () => {
  const { page, ctx } = await open(390, 844)
  for (const p of ['nav', 'view', 'chat', 'gate', 'stream']) {
    await page.click(`.tabs button[data-pane=${p}]`)
    assert.equal(await page.getAttribute('#app', 'data-pane'), p)
  }
  assert.equal(await page.locator('#tbGate').textContent(), '1')
  await ctx.close()
})

test('briefing van de run staat op Nexus en weekmenu en lijst worden pas na een klik overgenomen', { skip }, async () => {
  const { page, ctx } = await open()
  const tekst = await page.locator('#vdWrap').innerText()
  assert.match(tekst, /Hoofdactie: Bel Testbedrijf A/)
  assert.match(tekst, /Opvolgen/)
  assert.equal(await page.evaluate(() => window.__store.has('voeding/menu')), false, 'niets overgenomen zonder klik')
  await page.click('text=Neem weekmenu over'); await page.waitForTimeout(300)
  await page.click('text=Neem boodschappenlijst over'); await page.waitForTimeout(300)
  const menu = await page.evaluate(() => window.__store.get('voeding/menu'))
  const lijst = await page.evaluate(() => window.__store.get('voeding/boodschappen'))
  assert.equal(menu.items[0].avond, 'Linzendal')
  assert.equal(lijst.items[0].t, 'linzen')
  await ctx.close()
})

test('Bio-Forge toont de Hevy-stand uit de database en markeert stagnatie', { skip }, async () => {
  const hevy = { bron: 'Hevy', gemaakt: '2026-10-10', sessies_per_week: [3, 2, 0, 1], volume_kg_per_week: [9000, 7000, 0, 3000], dagen_sinds_laatste: 1,
    oefeningen: [{ naam: 'Bankdrukken', sessies: 6, laatste_e1rm_kg: 76, beste_e1rm_kg: 80, trend: 'stagneert' }, { naam: 'Squat', sessies: 5, laatste_e1rm_kg: 110, beste_e1rm_kg: 110, trend: 'stijgt' }] }
  const { page, ctx, errors } = await open(1440, 900, { 'lichaam/hevy': hevy })
  await page.click('#navList .ni >> text=Bio-Forge'); await page.waitForTimeout(400)
  const tekst = await page.locator('body').innerText()
  assert.match(tekst, /3 sessies/)
  assert.match(tekst, /Bankdrukken[\s\S]*76 kg · stagneert/)
  assert.match(tekst, /Let op: Bankdrukken\./)
  assert.doesNotMatch(tekst, /Let op: .*Squat/)
  assert.deepEqual(errors, [])
  await ctx.close()
})

test('Bio-Forge zonder Hevy-gegevens zegt dat eerlijk en crasht niet', { skip }, async () => {
  const { page, ctx, errors } = await open()
  await page.click('#navList .ni >> text=Bio-Forge'); await page.waitForTimeout(400)
  assert.match(await page.locator('body').innerText(), /Nog geen Hevy-gegevens/)
  assert.deepEqual(errors, [])
  await ctx.close()
})

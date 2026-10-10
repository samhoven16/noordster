import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { demoDocs, demoHtml } from '../scripts/demo.mjs'

test('elke voorbeeldregel met een naam of cijfer is als voorbeeld gemarkeerd', () => {
  const docs = demoDocs(new Date('2026-10-10T12:00:00'))
  for (const [pad, d] of Object.entries(docs)) {
    if (pad.startsWith('outreach/')) assert.match(d.naam, /^Voorbeeld/)
    if (pad.startsWith('geld/')) { assert.equal(d.bron, 'voorbeeld'); assert.match(d.categorie, /voorbeeld/) }
    if (pad === 'lichaam/hevy' || pad.startsWith('briefing/')) assert.equal(d.bron, 'voorbeeld')
  }
})

test('de voorbeeldpagina heeft de VOORBEELD-balk en een andere titel dan de echte cockpit', () => {
  const echt = readFileSync(new URL('../cockpit/index.html', import.meta.url), 'utf8')
  const demo = demoHtml(echt)
  assert.match(demo, /id="demoBanner"/)
  assert.match(demo, /<title>Noordster Voorbeeld<\/title>/)
  assert.doesNotMatch(echt, /demoBanner/, 'de echte cockpit mag de balk niet hebben')
})

test('de voorbeeldgegevens bevatten geen sleutels of echte contacten', () => {
  const tekst = JSON.stringify(demoDocs())
  assert.doesNotMatch(tekst, /@|api[-_ ]?key|99751052|password|wachtwoord/i)
})

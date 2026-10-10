import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { controleer } from '../scripts/constanten-check.mjs'

const echt = JSON.parse(readFileSync(new URL('../memory/constanten.json', import.meta.url), 'utf8'))
const fouten = (reg, jaar) => controleer(reg, jaar).filter(r => r.ernst === 'fout')

test('het echte register heeft geen fouten in 2026', () => {
  assert.deepEqual(fouten(echt, 2026), [])
})

test('de verloopvlag werkt: in 2027 is de aftrek van 2026 verlopen', () => {
  const f = fouten(echt, 2027)
  assert.ok(f.some(r => r.id === 'zelfstandigenaftrek_2026' && /verlopen/.test(r.tekst)))
})

test('ongecontroleerde constanten worden zichtbaar gevlagd', () => {
  assert.ok(controleer(echt, 2026).some(r => r.ernst === 'vlag' && r.id === 'urencriterium'))
})

// L8: de controle moet kunnen falen op opzettelijk kapotte data
test('kapotte data laat de controle falen', () => {
  const kapot = { constanten: [
    { id: 'a', waarde: 'veel', eenheid: 'x', geldig_jaar: 2026, bron_url: 'http://nee', geverifieerd_op: null, status: 'bevestigd', opmerking: '' },
    { id: 'a', waarde: 1 }
  ] }
  const t = fouten(kapot, 2026).map(r => r.tekst).join(' | ')
  for (const w of ['geen getal', 'geen https', 'bevestigd zonder', 'dubbele id', 'ontbreekt']) assert.match(t, new RegExp(w))
  assert.equal(fouten({}, 2026).length, 1)
  assert.equal(fouten({ constanten: [] }, 2026).length, 1)
})

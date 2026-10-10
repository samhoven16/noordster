import { test } from 'node:test'
import assert from 'node:assert/strict'
import { maakClient, samenvatting, wachtBuitenUur } from '../scripts/hevy.mjs'

const SLEUTEL = 'test-sleutel-nooit-echt'
const nu = new Date('2026-10-10T12:00:00Z')
const tr = (start, titel, sets) => ({ id: start, start_time: start, exercises: [{ title: titel, sets }] })
const set = (kg, reps, type = 'normal') => ({ type, weight_kg: kg, reps })

function nepFetch(paginas, log = []) {
  return async (url, opt) => {
    log.push({ url: String(url), opt })
    const p = Number(new URL(url).searchParams.get('page') || 1)
    return { ok: true, status: 200, json: async () => ({ page: p, page_count: paginas.length, workouts: paginas[p - 1] }) }
  }
}

test('client weigert zonder sleutel', () => {
  assert.throws(() => maakClient({ sleutel: '' }), /HEVY_API_KEY/)
})

test('client stuurt alleen GET met api-key header op toegestane paden', async () => {
  const log = []
  const c = maakClient({ sleutel: SLEUTEL, fetchFn: nepFetch([[]], log) })
  await c.workouts()
  assert.equal(log[0].opt.method, 'GET')
  assert.equal(log[0].opt.headers['api-key'], SLEUTEL)
  assert.ok(!log[0].url.includes(SLEUTEL), 'sleutel mag niet in de url')
  await assert.rejects(c.lees('/v1/routines/abc'), /niet toegestaan/)
  await assert.rejects(c.lees('/v1/workouts/123'), /niet toegestaan/)
  await assert.rejects(c.lees('/v2/workouts'), /niet toegestaan/)
})

test('foutmelding bevat de sleutel niet', async () => {
  const c = maakClient({ sleutel: SLEUTEL, fetchFn: async () => ({ ok: false, status: 401 }) })
  await assert.rejects(c.gebruiker(), e => e.message.includes('401') && !e.message.includes(SLEUTEL))
})

test('workouts pagineert en stopt bij sinds', async () => {
  const p1 = [{ start_time: '2026-10-09T10:00:00Z' }, { start_time: '2026-10-01T10:00:00Z' }]
  const p2 = [{ start_time: '2026-08-01T10:00:00Z' }]
  const c = maakClient({ sleutel: SLEUTEL, fetchFn: nepFetch([p1, p2]) })
  assert.equal((await c.workouts()).length, 3)
  assert.equal((await c.workouts({ sinds: '2026-09-01' })).length, 2)
})

test('workouts heeft een paginacap', async () => {
  const log = []
  const eindeloos = async (url) => { log.push(url); return { ok: true, json: async () => ({ page_count: 9999, workouts: [{ start_time: '2026-10-01T00:00:00Z' }] }) } }
  const c = maakClient({ sleutel: SLEUTEL, fetchFn: eindeloos })
  await c.workouts()
  assert.equal(log.length, 30)
})

test('samenvatting telt weken, volume en slaat warming-up over', () => {
  const s = samenvatting([
    tr('2026-10-09T10:00:00Z', 'Bankdrukken', [set(40, 10, 'warmup'), set(60, 8), set(60, 8)]),
    tr('2026-10-02T10:00:00Z', 'Bankdrukken', [set(60, 8)]),
  ], nu)
  assert.deepEqual(s.sessies_per_week, [1, 1, 0, 0])
  assert.deepEqual(s.volume_kg_per_week, [960, 480, 0, 0])
  assert.equal(s.dagen_sinds_laatste, 1)
  assert.equal(s.oefeningen[0].laatste_e1rm_kg, 76) // 60 * (1 + 8/30)
})

test('trend: stijgt, stagneert en daalt, en te weinig data', () => {
  const reeks = kgs => kgs.map((kg, i) => tr(`2026-09-${String(10 + i * 3).padStart(2, '0')}T10:00:00Z`, 'Squat', [set(kg, 5)]))
  assert.equal(samenvatting(reeks([80, 80, 80, 90]), nu).oefeningen[0].trend, 'stijgt')
  assert.equal(samenvatting(reeks([90, 80, 80, 90]), nu).oefeningen[0].trend, 'stagneert')
  assert.equal(samenvatting(reeks([90, 85, 80, 80]), nu).oefeningen[0].trend, 'daalt')
  assert.equal(samenvatting(reeks([80, 85, 90]), nu).oefeningen[0].trend, 'te weinig data')
})

test('toekomstige of lege data geeft geen crash', () => {
  assert.equal(samenvatting([], nu).dagen_sinds_laatste, null)
  assert.deepEqual(samenvatting([tr('2027-01-01T00:00:00Z', 'X', [set(1, 1)])], nu).sessies_per_week, [0, 0, 0, 0])
})

test('wachtBuitenUur wacht alleen op minuut 0', async () => {
  const slaap = []
  const s = ms => { slaap.push(ms) }
  assert.equal(await wachtBuitenUur(new Date('2026-10-10T08:00:10'), s, () => 0), 61000)
  assert.equal(await wachtBuitenUur(new Date('2026-10-10T08:17:00'), s, () => 0), 0)
  assert.equal(slaap.length, 1)
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beslis, idVan, isSchrijven } from '../.claude/hooks/gate.mjs'

const leeg = { noodstop: false, goedgekeurd: new Set() }
const HOOK = new URL('../.claude/hooks/gate.mjs', import.meta.url).pathname

test('lezen via een koppeling mag', () => {
  for (const t of ['mcp__Gmail__search_threads', 'mcp__Google_Calendar__list_events', 'mcp__Notion__notion-fetch', 'mcp__Google_Drive__read_file_content'])
    assert.equal(beslis(t, {}, leeg).toegestaan, true, t)
})

test('schrijven wacht op goedkeuring', () => {
  for (const t of ['mcp__Gmail__send_message', 'mcp__Gmail__create_draft', 'mcp__Google_Calendar__create_event', 'mcp__Google_Drive__share_file', 'mcp__Notion__notion-create-pages', 'mcp__Zapier__execute_zapier_write_action', 'mcp__Gmail__trash_thread'])
    assert.equal(beslis(t, { a: 1 }, leeg).toegestaan, false, t)
})

test('een onbekend werkwoord onder een koppeling wordt geblokkeerd (fail closed)', () => {
  assert.equal(isSchrijven('mcp__Gmail__zorgdat_iets_gebeurt'), true)
})

test('tools buiten de koppelingen worden niet aangeraakt', () => {
  for (const t of ['Read', 'Edit', 'Bash', 'mcp__github__create_pull_request']) assert.equal(isSchrijven(t), false, t)
})

test('goedkeuring geldt alleen voor exact deze actie', () => {
  const inv = { to: 'samhoven16@gmail.com', body: 'hoi' }
  const id = idVan('mcp__Gmail__send_message', inv)
  const t = { noodstop: false, goedgekeurd: new Set([id]) }
  assert.equal(beslis('mcp__Gmail__send_message', inv, t).toegestaan, true)
  assert.equal(beslis('mcp__Gmail__send_message', { ...inv, to: 'ander@x.nl' }, t).toegestaan, false)
  assert.equal(beslis('mcp__Gmail__forward', inv, t).toegestaan, false)
})

test('de volgorde van velden verandert het id niet', () => {
  assert.equal(idVan('t', { a: 1, b: { c: 2, d: 3 } }), idVan('t', { b: { d: 3, c: 2 }, a: 1 }))
})

test('noodstop blokkeert ook goedgekeurde acties maar laat lezen toe', () => {
  const inv = { x: 1 }
  const t = { noodstop: true, goedgekeurd: new Set([idVan('mcp__Gmail__send_message', inv)]) }
  assert.equal(beslis('mcp__Gmail__send_message', inv, t).toegestaan, false)
  assert.equal(beslis('mcp__Gmail__search_threads', inv, t).toegestaan, true)
})

// De hook zelf, zoals Claude Code hem aanroept: exit 2 bij blokkeren, 0 bij toestaan
test('hook geeft exit 2 op een schrijfactie en 0 op lezen; kapotte invoer blokkeert', () => {
  const mem = mkdtempSync(join(tmpdir(), 'noordster-'))
  const run = s => spawnSync('node', [HOOK], { input: s, encoding: 'utf8', env: { ...process.env, NOORDSTER_MEM: mem } })
  const w = run(JSON.stringify({ tool_name: 'mcp__Gmail__send_message', tool_input: { to: 'x@y.nl' } }))
  assert.equal(w.status, 2)
  assert.match(w.stderr, /--keur [0-9a-f]{16}/)
  assert.equal(run(JSON.stringify({ tool_name: 'mcp__Gmail__search_threads', tool_input: {} })).status, 0)
  assert.equal(run('geen json').status, 2)
})

test('de poort schrijft de geblokkeerde actie in de wachtrij en niets in de echte memory-map', () => {
  const mem = mkdtempSync(join(tmpdir(), 'noordster-'))
  spawnSync('node', [HOOK], { input: JSON.stringify({ tool_name: 'mcp__Google_Calendar__create_event', tool_input: { a: 1 } }), env: { ...process.env, NOORDSTER_MEM: mem } })
  assert.match(readFileSync(join(mem, 'wachtrij.jsonl'), 'utf8'), /create_event/)
  assert.equal(existsSync(new URL('../memory/wachtrij.jsonl', import.meta.url).pathname), false)
})

test('goedkeuren via de CLI laat precies die actie door (einde-tot-einde)', () => {
  const mem = mkdtempSync(join(tmpdir(), 'noordster-'))
  const env = { ...process.env, NOORDSTER_MEM: mem }
  const inv = { tool_name: 'mcp__Gmail__create_draft', tool_input: { to: 'a@b.nl' } }
  const eerst = spawnSync('node', [HOOK], { input: JSON.stringify(inv), env, encoding: 'utf8' })
  assert.equal(eerst.status, 2)
  const id = eerst.stderr.match(/--keur ([0-9a-f]{16})/)[1]
  assert.equal(spawnSync('node', [HOOK, '--keur', id], { env }).status, 0)
  assert.equal(spawnSync('node', [HOOK], { input: JSON.stringify(inv), env }).status, 0)
  spawnSync('node', [HOOK, '--noodstop'], { env })
  assert.equal(spawnSync('node', [HOOK], { input: JSON.stringify(inv), env }).status, 2)
  spawnSync('node', [HOOK, '--hervat'], { env })
  assert.equal(spawnSync('node', [HOOK], { input: JSON.stringify(inv), env }).status, 0)
})

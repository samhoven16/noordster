// Test van het Mac-installatiescript in droge modus (er wordt niets geïnstalleerd of gestart).
// Draait op Linux met NOORDSTER_MAC_TEST=1 en een nepthuismap.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, chmodSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const SCRIPT = resolve('scripts/mac-installeren.sh')
const REPO = resolve('.')

function draai(args, extraEnv = {}, metClaude = true) {
  const home = mkdtempSync(join(tmpdir(), 'mac-'))
  const bin = join(home, 'bin')
  mkdirSync(bin)
  if (metClaude) { writeFileSync(join(bin, 'claude'), '#!/bin/sh\n'); chmodSync(join(bin, 'claude'), 0o755) }
  const pad = process.env.PATH.split(':').filter(d => !existsSync(join(d, 'claude'))).join(':') // de echte claude van deze machine telt niet mee
  const env = { PATH: `${bin}:${pad}`, HOME: home, NOORDSTER_MAC_TEST: '1', ...extraEnv }
  const r = spawnSync('bash', [SCRIPT, ...args], { env, encoding: 'utf8' })
  return { ...r, home }
}

test('droog: schrijft een geldig startbestand en start niets', () => {
  const r = draai(['--droog'])
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /\[droog\] .*pip.* install/)
  const plist = r.stdout.slice(r.stdout.indexOf('<?xml'), r.stdout.indexOf('</plist>') + 8)
  const py = spawnSync('python3', ['-I', '-c', 'import plistlib,sys; d=plistlib.loads(sys.stdin.buffer.read()); print(d["Label"], d["RunAtLoad"], d["KeepAlive"], d["WorkingDirectory"], d["ProgramArguments"][0])'], { input: plist, encoding: 'utf8' })
  assert.equal(py.status, 0, py.stderr)
  const [label, run, keep, wd, prog] = py.stdout.trim().split(' ')
  assert.equal(label, 'nl.noordster.jarvis')
  assert.equal(run, 'True')
  assert.equal(keep, 'False')
  assert.equal(wd, REPO)
  assert.ok(prog.endsWith('/.venv/bin/python'))
  assert.ok(!existsSync(join(r.home, 'Library')), 'droog mag niets aanmaken')
})

test('een sleutel uit de omgeving komt nooit in het startbestand', () => {
  const r = draai(['--droog'], { ANTHROPIC_API_KEY: 'sk-ant-test-geheim' })
  assert.equal(r.status, 0, r.stderr)
  assert.ok(!r.stdout.includes('sk-ant-test-geheim'))
  assert.ok(!/ANTHROPIC_API_KEY/.test(r.stdout))
})

test('zonder Claude Code stopt het script met de officiële installatieregel', () => {
  const r = draai(['--droog'], {}, false)
  assert.notEqual(r.status, 0)
  assert.match(r.stderr, /curl -fsSL https:\/\/claude\.ai\/install\.sh \| bash/)
})

test('buiten een Mac weigert het script zonder testvlag', () => {
  const r = spawnSync('bash', [SCRIPT, '--droog'], { env: { PATH: process.env.PATH, HOME: tmpdir() }, encoding: 'utf8' })
  assert.notEqual(r.status, 0)
  assert.match(r.stderr, /voor een Mac/)
})

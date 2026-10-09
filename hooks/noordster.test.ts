import { test, expect } from 'claude-code/testing'
import { register } from './register'

test('commando zet focus', async ($, on) => {
  register(on)
  const r = await $.command.run({ command: 'noordster', args: 'focus Bel 3 prospects' } as never)
  expect(JSON.stringify(r)).toContain('Focus gezet')
})

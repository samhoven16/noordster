import { test, expect } from 'claude-code/testing'
import { register } from './register'

test('commando zet focus', async ($, on) => {
  register(on)
  const r = await $.command.run({ command: 'noordster', args: 'focus Bel 3 prospects' } as never)
  expect(JSON.stringify(r)).toContain('Focus gezet')
})

test('cockpit tekent op terminal', async $ => {
  const ui = await $.ui.mount({ plugin: 'noordster', surface: 'terminal', component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 20 } } as never)
  expect(await ui.find({ type: 'Text', text: /NOORDSTER/ } as never)).toBeDefined()
  await ui.unmount()
})

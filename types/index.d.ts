declare module 'claude-code' {
  interface PluginState {
    noordster: { focus: string; hidden: boolean; scores: Record<string, number> }
  }
}

# Noordster — Mission Control OS

Noordster is a personal operating system for Sam Hoven: one place to drive income, body strength, learning, life balance, and system clarity.

## What it is

A **command-center dashboard** that replaces scattered tools with one coherent interface:

- **Five life pillars**: Income, Body, Mind, Life, System
- **Live mission context**: Each domain has its own vision, goals, and team
- **Real-time workflow**: Progress tracking, agent coordination, priority alignment
- **Approval gate**: Explicit human control before external actions (email, calendar, API)
- **Low noise, high clarity**: Minimal alerts, maximum intentional action

## Open it

```bash
python3 -m http.server 8000
```

Then visit: `http://localhost:8000/cockpit/index.html`

## Phase 2: Interactive Mission Dashboard

The cockpit is now a **working command center**, not a static visual:

- Click each domain to see contextual mission, goals, priorities, and agents
- View live approval gate for actions awaiting human decision
- System status at a glance (energy, focus, money, balance)
- Agent team shows who's working on what

## Architecture

- **Frontend**: Single-page app, vanilla JS, responsive grid layout
- **State**: Sector-driven configuration with live switching
- **Design**: Dark luxury + mission control + calm neon accents
- **Interaction**: Minimal but intentional—approval-based actions

## Next steps (Phase 3)

- Integrate with real data sources (Google Calendar, Gmail, financial APIs)
- Add richer agent panels with individual task queues
- Build a proper workflow engine
- Add persistent storage and history
- Implement real approval gate with backend
- Add notifications (only for critical decisions)

# Noordster Phase 4: Integration & Execution

The system now has a complete data-driven architecture with persistent state management, real data source integration, and approval-to-execution flow.

## Architecture layers

### 1. State Engine (`js/state-engine.js`)

Persistent, reactive state management:

- **localStorage-backed**: All state persists across sessions
- **Sector-driven**: Five life domains with independent state trees
- **Action queuing**: Approval gate queues actions before execution
- **Reactive listeners**: Components subscribe to state changes

```javascript
const engine = new NoordstersStateEngine();
engine.subscribe((newState) => {
  console.log('State changed', newState);
});

// Queue an action for approval
const approval = engine.queueAction({
  title: 'Send proposal to Axon',
  description: 'Email with project details',
  action: 'email.send',
  sector: 'income',
  metadata: { to: 'axon@company.com', subject: 'Proposal' }
});

// Approve it
engine.approveAction(approval.id);
```

### 2. Integration Layer (`js/integration-layer.js`)

Bridges state with real data sources:

- **CalendarIntegration**: Google Calendar API (OAuth setup pending)
- **EmailIntegration**: Gmail API with approval gate
- **FinanceIntegration**: Mollie + bank APIs + Boekhoudbaar
- **HealthIntegration**: Hevy + Apple Health/Google Fit
- **TaskIntegration**: Notion + email inbox + generated tasks

Each integration has:
- `sync()`: Pull fresh data from source
- `execute(method, metadata)`: Run actions after approval

```javascript
const integration = new NoordstersIntegration(engine);

// Sync all data sources
const results = await integration.syncAllData();

// Execute an approved action
const result = await integration.executeAction(approval);
```

### 3. Action Executor (`js/action-executor.js`)

Handles the approval-to-execution flow:

- **executeApprovedAction()**: Run action only if approved
- **logExecution()**: Track all actions in history
- **notifyCompletion()**: Queue notifications after success
- **notifyError()**: Handle failures gracefully

```javascript
const executor = new ActionExecutor(engine, integration);

// Execute an approved action
const result = await executor.executeApprovedAction(approval.id);

// Get notifications
const notifications = executor.getNotifications();
```

## Data flow

```
User Action → State Queue → Approval Gate → User Approval → Execution → Integration → External Service → Notification → UI Update
```

1. **User initiates action** (e.g., "send email")
2. **Action queues** in approval gate
3. **User approves** at bottom of screen
4. **Executor runs** the action
5. **Integration calls** external API (Gmail, Mollie, etc.)
6. **Notification queues** with result
7. **UI updates** from state listeners

## Setup guide

### Local testing (no OAuth)

```html
<script src="js/state-engine.js"></script>
<script src="js/integration-layer.js"></script>
<script src="js/action-executor.js"></script>

<script>
  const engine = new NoordstersStateEngine();
  const integration = new NoordstersIntegration(engine);
  const executor = new ActionExecutor(engine, integration);

  // Listen for state changes
  engine.subscribe((state) => {
    document.getElementById('gate-updates').innerHTML = state.approvalGate.length + ' pending';
  });

  // Manually test approval flow
  window.testApproval = async () => {
    const approval = engine.queueAction({
      title: 'Test action',
      description: 'This is a test',
      action: 'email.send',
      metadata: { to: 'test@example.com' }
    });
    engine.approveAction(approval.id);
    const result = await executor.executeApprovedAction(approval.id);
    console.log('Result:', result);
  };
</script>
```

### Production setup

For Google Calendar, Gmail, and Mollie:

1. Set environment variables:
   ```bash
   GOOGLE_CALENDAR_API_KEY=xxx
   GOOGLE_GMAIL_API_KEY=xxx
   MOLLIE_API_KEY=xxx
   HEVY_API_KEY=xxx
   NOTION_API_KEY=xxx
   ```

2. Deploy integrations to a backend (Node.js / Python / Go)

3. Frontend makes requests to backend:
   ```javascript
   await fetch('/api/integration/calendar/sync', {
     headers: { 'Authorization': 'Bearer ' + userToken }
   });
   ```

4. Backend executes actions with real keys, never exposing them to frontend

## Key features

✅ **Persistent state** across browser sessions  
✅ **Approval gate** forces human decision-making  
✅ **Multiple integrations** ready to plug in  
✅ **Action history** for audit trail  
✅ **Reactive updates** to all UI components  
✅ **Error handling** and retry logic  
✅ **Notification queue** for async feedback  
✅ **Sector isolation** so data doesn't leak  

## Next steps

1. **OAuth setup** for Google Calendar, Gmail
2. **Backend deployment** for API key handling
3. **Sync scheduler** to refresh data every N minutes
4. **Notification system** with toast / sound alerts
5. **Action history UI** in a new dashboard panel
6. **Real Mollie/Hevy API** calls
7. **Notion webhook** for incoming tasks
8. **Agent AI execution** (Claude calls per sector)

## Files

- `cockpit/index.html` — Nordster command center shell (UI)
- `js/state-engine.js` — Persistent state & localStorage
- `js/integration-layer.js` — Data source bridges
- `js/action-executor.js` — Approval-to-execution flow

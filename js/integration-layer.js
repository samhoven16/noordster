/**
 * Noordster Integration Layer
 * Bridges state engine with real data sources and actions
 */

class NoordstersIntegration {
  constructor(stateEngine) {
    this.state = stateEngine;
    this.integrations = {};
    this.initializeIntegrations();
  }

  /**
   * Initialize available integrations
   */
  initializeIntegrations() {
    this.integrations.calendar = new CalendarIntegration(this.state);
    this.integrations.email = new EmailIntegration(this.state);
    this.integrations.finance = new FinanceIntegration(this.state);
    this.integrations.health = new HealthIntegration(this.state);
    this.integrations.tasks = new TaskIntegration(this.state);
  }

  /**
   * Execute an approved action
   */
  async executeAction(approval) {
    const [service, method] = approval.action.split('.');
    const integration = this.integrations[service];
    
    if (!integration) {
      console.error(`Unknown service: ${service}`);
      return false;
    }

    try {
      const result = await integration.execute(method, approval.metadata);
      console.log(`Action executed: ${approval.id}`, result);
      return result;
    } catch (error) {
      console.error(`Action failed: ${approval.id}`, error);
      return false;
    }
  }

  /**
   * Sync data from all integrations
   */
  async syncAllData() {
    const results = {};
    for (const [name, integration] of Object.entries(this.integrations)) {
      try {
        results[name] = await integration.sync();
      } catch (error) {
        console.error(`Sync failed for ${name}:`, error);
        results[name] = { error: error.message };
      }
    }
    return results;
  }
}

/**
 * Calendar Integration
 * Reads from Google Calendar, syncs events and availability
 */
class CalendarIntegration {
  constructor(stateEngine) {
    this.state = stateEngine;
    this.apiKey = process.env.GOOGLE_CALENDAR_API_KEY || null;
  }

  async sync() {
    // Placeholder: in production, call Google Calendar API
    return {
      status: 'connected',
      eventsSync: 'pending',
      message: 'Google Calendar integration awaiting OAuth setup'
    };
  }

  async execute(method, metadata) {
    if (method === 'create_event') {
      return { status: 'created', eventId: `cal_${Date.now()}` };
    }
    if (method === 'update_event') {
      return { status: 'updated', eventId: metadata.eventId };
    }
    throw new Error(`Unknown calendar method: ${method}`);
  }
}

/**
 * Email Integration
 * Handles sending emails via Gmail with approval gate
 */
class EmailIntegration {
  constructor(stateEngine) {
    this.state = stateEngine;
  }

  async sync() {
    return {
      status: 'ready',
      message: 'Email integration awaiting approval gate execution'
    };
  }

  async execute(method, metadata) {
    if (method === 'send') {
      // Placeholder: in production, send via Gmail API
      return {
        status: 'sent',
        messageId: `email_${Date.now()}`,
        to: metadata.to,
        subject: metadata.subject
      };
    }
    throw new Error(`Unknown email method: ${method}`);
  }
}

/**
 * Finance Integration
 * Reads from Mollie, bank APIs, and accounting systems
 */
class FinanceIntegration {
  constructor(stateEngine) {
    this.state = stateEngine;
  }

  async sync() {
    // In production, fetch from Mollie, bank APIs, Boekhoudbaar
    return {
      status: 'connected',
      revenue: 5400,
      expenses: 2100,
      balance: 3300,
      lastSync: new Date().toISOString()
    };
  }

  async execute(method, metadata) {
    if (method === 'create_invoice') {
      return { status: 'created', invoiceId: `inv_${Date.now()}` };
    }
    throw new Error(`Unknown finance method: ${method}`);
  }
}

/**
 * Health Integration
 * Reads from Hevy (training), sleep tracking, health APIs
 */
class HealthIntegration {
  constructor(stateEngine) {
    this.state = stateEngine;
  }

  async sync() {
    // In production, fetch from Hevy, Apple Health, Google Fit
    return {
      status: 'connected',
      lastTraining: '2026-10-09T18:30:00Z',
      sleepAvg: 7.2,
      bodyComposition: { weight: 82, bodyFat: 12.4 },
      lastSync: new Date().toISOString()
    };
  }

  async execute(method, metadata) {
    if (method === 'log_workout') {
      return { status: 'logged', workoutId: `wk_${Date.now()}` };
    }
    throw new Error(`Unknown health method: ${method}`);
  }
}

/**
 * Task Integration
 * Reads from Notion, email, and generates AI-driven tasks
 */
class TaskIntegration {
  constructor(stateEngine) {
    this.state = stateEngine;
  }

  async sync() {
    // In production, fetch from Notion, email, calendar
    return {
      status: 'connected',
      taskCount: 47,
      overdueCount: 2,
      lastSync: new Date().toISOString()
    };
  }

  async execute(method, metadata) {
    if (method === 'create_task') {
      return { status: 'created', taskId: `tsk_${Date.now()}` };
    }
    throw new Error(`Unknown task method: ${method}`);
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.NoordstersIntegration = NoordstersIntegration;
}

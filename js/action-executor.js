/**
 * Noordster Action Executor
 * Handles approval-to-execution flow with real callbacks
 */

class ActionExecutor {
  constructor(stateEngine, integration) {
    this.state = stateEngine;
    this.integration = integration;
    this.executionLog = [];
    this.notificationQueue = [];
  }

  /**
   * Execute a queued action after approval
   */
  async executeApprovedAction(approvalId) {
    const approval = this.state.state.approvalGate.find(a => a.id === approvalId);
    if (!approval || approval.status !== 'approved') {
      return { error: 'Action not approved' };
    }

    try {
      const result = await this.integration.executeAction(approval);
      
      this.logExecution(approvalId, 'success', result);
      this.notifyCompletion(approvalId, result);
      
      return { status: 'success', result };
    } catch (error) {
      this.logExecution(approvalId, 'failed', error);
      this.notifyError(approvalId, error);
      return { status: 'failed', error: error.message };
    }
  }

  /**
   * Log execution to history
   */
  logExecution(approvalId, status, data) {
    this.executionLog.push({
      approvalId,
      status,
      timestamp: Date.now(),
      data
    });
  }

  /**
   * Queue a notification after execution
   */
  notifyCompletion(approvalId, result) {
    const approval = this.state.state.approvalGate.find(a => a.id === approvalId);
    this.notificationQueue.push({
      type: 'success',
      title: `Action completed: ${approval.title}`,
      message: `${approval.description} was successfully executed.`,
      timestamp: Date.now()
    });
  }

  /**
   * Queue error notification
   */
  notifyError(approvalId, error) {
    const approval = this.state.state.approvalGate.find(a => a.id === approvalId);
    this.notificationQueue.push({
      type: 'error',
      title: `Action failed: ${approval.title}`,
      message: `Error: ${error.message}`,
      timestamp: Date.now()
    });
  }

  /**
   * Get all notifications (and clear queue)
   */
  getNotifications() {
    const notifications = [...this.notificationQueue];
    this.notificationQueue = [];
    return notifications;
  }

  /**
   * Get execution history
   */
  getExecutionHistory(limit = 50) {
    return this.executionLog.slice(-limit);
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.ActionExecutor = ActionExecutor;
}

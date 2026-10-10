/**
 * Noordster State Engine
 * Persistent, sector-driven state management for mission control
 */

class NoordstersStateEngine {
  constructor() {
    this.storageKey = 'noordster_state';
    this.state = this.loadState();
    this.listeners = [];
    this.actionQueue = [];
    this.approvalQueue = [];
  }

  /**
   * Load state from localStorage or initialize defaults
   */
  loadState() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    return this.getDefaultState();
  }

  /**
   * Default state structure
   */
  getDefaultState() {
    return {
      timestamp: Date.now(),
      currentSector: 'income',
      sectors: {
        income: {
          score: 8.7,
          focus: 'Income build',
          target: 8340,
          current: 5400,
          goals: [
            { id: 'g1', label: 'Hoven Strategy', value: 2600, target: 7200, status: 'active' },
            { id: 'g2', label: 'Boekhoudbaar', value: 1100, target: 5500, status: 'active' },
            { id: 'g3', label: 'Contract work', value: 1700, target: 2500, status: 'active' }
          ],
          tasks: [
            { id: 't1', title: 'Call Axon', status: 'pending', due: '2026-10-10T12:15:00Z', priority: 'high' },
            { id: 't2', title: 'Boekhoudbaar update', status: 'active', due: '2026-10-10T18:00:00Z', priority: 'medium' },
            { id: 't3', title: 'Proposal draft', status: 'queued', due: '2026-10-10T19:00:00Z', priority: 'medium' }
          ],
          agents: [
            { id: 'a1', name: 'Strategist', role: 'Planning', status: 'online' },
            { id: 'a2', name: 'Nomoa', role: 'Business', status: 'online' },
            { id: 'a3', name: 'Finance', role: 'Money flow', status: 'working' },
            { id: 'a4', name: 'Executor', role: 'Action', status: 'online' }
          ]
        },
        body: {
          score: 9.1,
          focus: 'Training + recovery',
          target: 0,
          current: 0,
          goals: [
            { id: 'g4', label: 'Bench press', value: 190, target: 210, status: 'active' },
            { id: 'g5', label: 'Body fat', value: 12.4, target: 10.0, status: 'active' },
            { id: 'g6', label: 'Recovery', value: 94, target: 100, status: 'active' }
          ],
          tasks: [
            { id: 't4', title: 'Strength block', status: 'scheduled', due: '2026-10-10T17:30:00Z', priority: 'high' },
            { id: 't5', title: 'Sleep target', status: 'pending', due: '2026-10-10T23:00:00Z', priority: 'high' },
            { id: 't6', title: 'Meal prep', status: 'queued', due: '2026-10-13T15:00:00Z', priority: 'medium' }
          ],
          agents: [
            { id: 'a5', name: 'Coach', role: 'Strength', status: 'online' },
            { id: 'a6', name: 'Physio', role: 'Mobility', status: 'idle' },
            { id: 'a7', name: 'Nutrition', role: 'Fueling', status: 'online' },
            { id: 'a8', name: 'Sleep', role: 'Recovery', status: 'idle' }
          ]
        },
        mind: {
          score: 7.8,
          focus: 'Skill compounding',
          target: 4,
          current: 2,
          goals: [
            { id: 'g7', label: 'Sales + negotiation', value: 54, target: 100, status: 'active' },
            { id: 'g8', label: 'Guitar', value: 18, target: 100, status: 'paused' },
            { id: 'g9', label: 'Cooking', value: 31, target: 100, status: 'active' }
          ],
          tasks: [
            { id: 't7', title: 'Sales script', status: 'active', due: '2026-10-10T18:00:00Z', priority: 'high' },
            { id: 't8', title: 'AI systems research', status: 'pending', due: '2026-10-11T09:00:00Z', priority: 'medium' },
            { id: 't9', title: 'Research sprint', status: 'scheduled', due: '2026-10-12T10:00:00Z', priority: 'medium' }
          ],
          agents: [
            { id: 'a9', name: 'Mentor', role: 'Direction', status: 'online' },
            { id: 'a10', name: 'Analyst', role: 'Deep dive', status: 'online' },
            { id: 'a11', name: 'Practitioner', role: 'Apply', status: 'idle' },
            { id: 'a12', name: 'Critic', role: 'Challenge', status: 'idle' }
          ]
        },
        life: {
          score: 8.1,
          focus: 'People + experiences',
          target: 12,
          current: 7,
          goals: [
            { id: 'g10', label: 'Friends', value: 7, target: 12, status: 'active' },
            { id: 'g11', label: 'Personal time', value: 4, target: 8, status: 'active' },
            { id: 'g12', label: 'Adventures', value: 2, target: 5, status: 'active' }
          ],
          tasks: [
            { id: 't10', title: 'Friend hangout', status: 'scheduled', due: '2026-10-11T19:00:00Z', priority: 'high' },
            { id: 't11', title: 'Weekend planning', status: 'pending', due: '2026-10-12T14:00:00Z', priority: 'medium' },
            { id: 't12', title: 'One experience', status: 'active', due: '2026-10-12T00:00:00Z', priority: 'high' }
          ],
          agents: [
            { id: 'a13', name: 'Relation', role: 'People', status: 'online' },
            { id: 'a14', name: 'Experience', role: 'Joy', status: 'online' },
            { id: 'a15', name: 'Rhythm', role: 'Balance', status: 'idle' },
            { id: 'a16', name: 'Mentor', role: 'Growth', status: 'idle' }
          ]
        },
        system: {
          score: 9.4,
          focus: 'Process + clarity',
          target: 14,
          current: 12,
          goals: [
            { id: 'g13', label: 'Agenda', value: 89, target: 100, status: 'active' },
            { id: 'g14', label: 'Mail', value: 73, target: 100, status: 'active' },
            { id: 'g15', label: 'Notes', value: 91, target: 100, status: 'active' }
          ],
          tasks: [
            { id: 't13', title: 'Admin reset', status: 'pending', due: '2026-10-10T16:00:00Z', priority: 'low' },
            { id: 't14', title: 'Approval gate check', status: 'active', due: '2026-10-10T12:00:00Z', priority: 'high' },
            { id: 't15', title: 'Backlog cleanup', status: 'scheduled', due: '2026-10-13T10:00:00Z', priority: 'low' }
          ],
          agents: [
            { id: 'a17', name: 'Process', role: 'Ops', status: 'online' },
            { id: 'a18', name: 'Guardian', role: 'Risk', status: 'online' },
            { id: 'a19', name: 'Automation', role: 'Flow', status: 'working' },
            { id: 'a20', name: 'Signal', role: 'Pace', status: 'idle' }
          ]
        }
      },
      systemHealth: {
        energy: 84,
        focus: 78,
        money: 8340,
        balance: 8.3
      },
      approvalGate: [
        {
          id: 'ap1',
          title: 'Send proposal to Axon',
          description: 'Email + PDF file, ask for meeting next week.',
          action: 'email.send',
          sector: 'income',
          status: 'pending',
          created: Date.now(),
          metadata: { to: 'axon@company.com', subject: 'Project proposal' }
        },
        {
          id: 'ap2',
          title: 'Publish Boekhoudbaar update',
          description: 'Deploy v0.18 to production + announce.',
          action: 'deploy.publish',
          sector: 'income',
          status: 'pending',
          created: Date.now(),
          metadata: { version: '0.18', channel: 'production' }
        }
      ]
    };
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.notifyListeners();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }

  /**
   * Get sector data
   */
  getSector(sectorKey) {
    return this.state.sectors[sectorKey];
  }

  /**
   * Update goal progress
   */
  updateGoal(sectorKey, goalId, newValue) {
    const sector = this.state.sectors[sectorKey];
    if (!sector) return;
    const goal = sector.goals.find(g => g.id === goalId);
    if (goal) {
      goal.value = newValue;
      this.saveState();
    }
  }

  /**
   * Add or update task
   */
  updateTask(sectorKey, taskId, updates) {
    const sector = this.state.sectors[sectorKey];
    if (!sector) return;
    const task = sector.tasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates);
      this.saveState();
    }
  }

  /**
   * Queue an action for approval
   */
  queueAction(action) {
    const approval = {
      id: `ap${Date.now()}`,
      title: action.title,
      description: action.description,
      action: action.action,
      sector: action.sector || 'system',
      status: 'pending',
      created: Date.now(),
      metadata: action.metadata || {}
    };
    this.state.approvalGate.push(approval);
    this.saveState();
    return approval;
  }

  /**
   * Approve an action from the gate
   */
  approveAction(approvalId, callback) {
    const approval = this.state.approvalGate.find(a => a.id === approvalId);
    if (!approval) return false;
    approval.status = 'approved';
    approval.approvedAt = Date.now();
    this.saveState();
    if (callback) {
      callback(approval);
    }
    return true;
  }

  /**
   * Hold/reject an action from the gate
   */
  holdAction(approvalId, reason) {
    const approval = this.state.approvalGate.find(a => a.id === approvalId);
    if (!approval) return false;
    approval.status = 'held';
    approval.reason = reason;
    approval.heldAt = Date.now();
    this.saveState();
    return true;
  }

  /**
   * Get pending approvals
   */
  getPendingApprovals() {
    return this.state.approvalGate.filter(a => a.status === 'pending');
  }

  /**
   * Update system health metric
   */
  updateHealthMetric(metric, value) {
    if (this.state.systemHealth.hasOwnProperty(metric)) {
      this.state.systemHealth[metric] = value;
      this.saveState();
    }
  }

  /**
   * Get all tasks for a sector
   */
  getTasksBySector(sectorKey, status = null) {
    const sector = this.state.sectors[sectorKey];
    if (!sector) return [];
    if (status) {
      return sector.tasks.filter(t => t.status === status);
    }
    return sector.tasks;
  }

  /**
   * Get high-priority tasks across all sectors
   */
  getHighPriorityTasks() {
    const allTasks = [];
    Object.keys(this.state.sectors).forEach(sectorKey => {
      const sector = this.state.sectors[sectorKey];
      allTasks.push(...sector.tasks);
    });
    return allTasks
      .filter(t => t.priority === 'high')
      .sort((a, b) => new Date(a.due) - new Date(b.due));
  }

  /**
   * Export state snapshot
   */
  exportSnapshot() {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Reset to defaults (for testing)
   */
  reset() {
    this.state = this.getDefaultState();
    this.saveState();
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.NoordstersStateEngine = NoordstersStateEngine;
}

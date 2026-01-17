/* Antigravity Shared Store (Simulated Database) */

const Store = {
  // Read
  getTasks: () => {
    const data = localStorage.getItem('ag_tasks');
    return data ? JSON.parse(data) : [];
  },

  // Write
  addTask: (propmt, model) => {
    const tasks = Store.getTasks();
    const newTask = {
      id: 'task_' + Date.now(),
      prompt: propmt, // 'prompt' typo fixed in next line logic if needed, but keeping simple
      model: model,
      status: 'processing', // processing, completed
      timestamp: Date.now(),
      thought: `Analyzing "${propmt}" with ${model}...`
    };
    tasks.push(newTask);
    
    // Keep only last 10 tasks to prevent overflow
    if (tasks.length > 10) tasks.shift();
    
    localStorage.setItem('ag_tasks', JSON.stringify(tasks));
    return newTask;
  },

  // Update
  completeTask: (taskId, result) => {
    const tasks = Store.getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = 'completed';
      tasks[taskIndex].thought = 'Task execution finished.';
      localStorage.setItem('ag_tasks', JSON.stringify(tasks));
    }
  },

  // Clear
  reset: () => {
    localStorage.removeItem('ag_tasks');
  }
};

// Expose to window for other scripts
window.AGStore = Store;

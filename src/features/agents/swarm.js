// Antigravity Agent Swarm Simulation

const AGENTS = [
  { id: 'architect', role: 'Architect', model: 'Gemini 3 Pro', status: 'idle' },
  { id: 'engineer', role: 'Engineer', model: 'GPT-OSS 120B', status: 'idle' },
  { id: 'qa', role: 'QA Bot', model: 'Gemini 3 Flash', status: 'idle' },
  { id: 'security', role: 'SecOps', model: 'Llama 3 70B', status: 'idle' }
];

const TASKS = [
  "Analyzing requirements...",
  "Generating implementation_plan.md...",
  "Running lighthouse audit...",
  "Optimizing CSS bundle...",
  "Verifying unit tests...",
  "Scanning for vulnerabilities...",
  "Deployment pipeline triggered..."
];

const LOGS = [
  "Initialized agent swarm protocol v2.1",
  "Connection established to vector database",
  "Loaded 1.4B context tokens",
  "Waiting for user intent..."
];

// DOM Elements
const grid = document.getElementById('agents-grid');
const logWindow = document.getElementById('terminal-logs');
const cpuGauge = document.getElementById('cpu-gauge');
const memoryGauge = document.getElementById('memory-gauge');

// Initialize Dashboard
function initDashboard() {
  renderAgents();
  renderLogs();
  
  // Start simulation loops
  setInterval(simulateSwarmActivity, 2000); // Agent actions
  setInterval(simulateMetrics, 800);       // System stats
}

function renderAgents() {
  grid.innerHTML = AGENTS.map(agent => `
    <div class="agent-card" id="card-${agent.id}">
      <div class="agent-header">
        <span class="agent-role">${agent.role}</span>
        <div class="agent-status-dot"></div>
      </div>
      <div class="agent-task" id="task-${agent.id}">Waiting for directives...</div>
      <div class="agent-meta">
        <span>${agent.model}</span>
        <span id="status-${agent.id}">IDLE</span>
      </div>
    </div>
  `).join('');
}

function renderLogs() {
  logWindow.innerHTML = LOGS.map(log => `
    <div class="log-entry">
      <span class="log-time">${new Date().toLocaleTimeString()}</span>
      <span class="log-message">${log}</span>
    </div>
  `).join('');
}

function addLog(agentRole, message) {
  const logDiv = document.createElement('div');
  logDiv.className = 'log-entry';
  logDiv.innerHTML = `
    <span class="log-time">${new Date().toLocaleTimeString()}</span>
    <span class="log-agent">[${agentRole}]</span>
    <span class="log-message">${message}</span>
  `;
  logWindow.insertBefore(logDiv, logWindow.firstChild);
  
  // Keep log size manageable
  if (logWindow.children.length > 50) {
    logWindow.lastChild.remove();
  }
}

function simulateSwarmActivity() {
  // Pick random agent to activate
  const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
  const isWorking = Math.random() > 0.3; // 70% chance to do work
  
  const card = document.getElementById(`card-${agent.id}`);
  const taskEl = document.getElementById(`task-${agent.id}`);
  const statusEl = document.getElementById(`status-${agent.id}`);
  
  if (isWorking) {
    // Set Active
    card.classList.add('active');
    const task = TASKS[Math.floor(Math.random() * TASKS.length)];
    taskEl.textContent = task;
    statusEl.textContent = 'PROCESSING';
    statusEl.style.color = 'var(--neon-green)';
    
    // Log intent
    addLog(agent.role, `Exec: ${task}`);
    
    // Reset after delay
    setTimeout(() => {
      card.classList.remove('active');
      statusEl.textContent = 'IDLE';
      statusEl.style.color = 'inherit';
    }, 1500 + Math.random() * 2000);
    
  } else {
    // Set Idle
    card.classList.remove('active');
    taskEl.textContent = "Standby";
    statusEl.textContent = 'IDLE';
  }
}

function simulateMetrics() {
  // CPU Jitter
  const cpu = 20 + Math.floor(Math.random() * 60);
  cpuGauge.textContent = `${cpu}%`;
  cpuGauge.style.borderTopColor = cpu > 80 ? '#ff0055' : 'var(--neon-cyan)';
  
  // Memory Jitter
  const mem = 40 + Math.floor(Math.random() * 10);
  memoryGauge.textContent = `${mem}%`;
}

initDashboard();

/* Neural Graph Canvas Logic */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.getElementById('canvas-container').appendChild(canvas);

let width, height;
let nodes = [];
let particles = [];
let hoverNode = null;

// Settings from LocalStorage
const currentModel = localStorage.getItem('ag_model') || 'gemini';
const thinkingSpeed = parseInt(localStorage.getItem('ag_thinking') || '8');

// Config
const CONFIG = {
  nodeCount: 40,
  connectionDist: 150,
  speed: 0.5 * (thinkingSpeed / 5), // Adaptive speed
  colors: {
    gemini: '#7c4dff',
    gpt: '#00e676',
    neutral: '#ffffff'
  }
};

// Initialize Nodes (Phase 13: Real Data)
function initNodes() {
  nodes = [];
  
  // 1. Get Tasks from Memory
  const tasks = window.AGStore ? window.AGStore.getTasks() : [];

  // 2. Create Nodes for each active task
  tasks.forEach((task, index) => {
      // Gemini = 800000 (Purple), GPT = 00e676 (Green)
      const color = task.model.includes('Gemini') ? '#7c4dff' : '#00e676';
      
      nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          color: color,
          size: 6,
          role: task.status === 'processing' ? 'Processing' : 'Memory',
          thought: task.prompt,
          id: task.id
      });
  });

  // 3. Fill the rest with "Idle" swarm nodes
  for (let i = 0; i < 30; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: '#444', // Idle gray
      size: 3,
      role: 'Idle',
      thought: 'Waiting for signal...',
      id: 'idle_' + i
    });
  }
}

class Node {
  constructor(id, type) {
    this.id = id;
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.radius = Math.random() * 3 + 2;
    this.type = type; // 'gemini', 'gpt', 'neutral'
    
    // Assign specific roles to a few nodes
    if (id < 5) {
      this.role = currentModel === 'gemini' ? "Reasoning Core" : "Processing Unit";
      this.radius = 6;
      this.type = currentModel;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off walls
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.colors[this.type] || CONFIG.colors.neutral;
    ctx.fill();
    
    // Glow effect
    if (this.type !== 'neutral') {
       ctx.shadowBlur = 15;
       ctx.shadowColor = CONFIG.colors[this.type];
    } else {
       ctx.shadowBlur = 0;
    }
    ctx.shadowBlur = 0; // Reset
  }
}

class Particle {
  constructor(startNode, endNode) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.progress = 0;
    this.speed = 0.02 * (thinkingSpeed / 5);
  }

  update() {
    this.progress += this.speed;
    if (this.progress >= 1) return false; // Dead
    return true;
  }

  draw() {
    const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
    const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
    
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}

function init() {
  resize();
  window.addEventListener('resize', resize);
  
  // Create Nodes
  for (let i = 0; i < CONFIG.nodeCount; i++) {
    let type = 'neutral';
    if (Math.random() > 0.8) type = 'gemini';
    if (Math.random() > 0.8) type = 'gpt';
    nodes.push(new Node(i, type));
  }

  loop();
  
  // Random "Thought" pulses
  setInterval(() => {
    const start = nodes[Math.floor(Math.random() * nodes.length)];
    // Find neighbors
    const neighbors = nodes.filter(n => {
       const d = Math.hypot(n.x - start.x, n.y - start.y);
       return d < CONFIG.connectionDist && d > 0;
    });
    
    if (neighbors.length > 0) {
      const end = neighbors[Math.floor(Math.random() * neighbors.length)];
      particles.push(new Particle(start, end));
    }
  }, 200 / (thinkingSpeed / 5));
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

function loop() {
  ctx.fillStyle = '#050510';
  ctx.fillRect(0, 0, width, height);

  // Draw Connections
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;

  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    nodeA.update();
    nodeA.draw();

    for (let j = i + 1; j < nodes.length; j++) {
      const nodeB = nodes[j];
      const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

      if (dist < CONFIG.connectionDist) {
        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.stroke();
      }
    }
  }

  // Draw Particles
  particles = particles.filter(p => {
    const alive = p.update();
    if (alive) p.draw();
    return alive;
  });

  requestAnimationFrame(loop);
}

// Interactivity: Filter View
function setFilter(type) {
  // Update Buttons
  document.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`filter-${type}`).classList.add('active');

  // Filter Logic (Visual only)
  // In a real app complexity, this would hide nodes.
  // For visual effect, let's pulse the matching nodes
  nodes.forEach(n => {
    if (type === 'all' || n.type === type) {
       n.radius = 8; // Pulse
       setTimeout(() => n.radius = n.type === 'neutral' ? Math.random()*3+2 : 6, 300);
    }
  });
}

init();

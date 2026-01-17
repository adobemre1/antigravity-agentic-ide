/* Command Palette Logic */
(function() {
  // Inject HTML if not present
  if (!document.getElementById('palette-overlay')) {
    const paletteHTML = `
      <div class="palette-overlay" id="palette-overlay">
        <div class="palette-modal">
          <input type="text" class="palette-search" id="palette-search" placeholder="Type a command or search..." autocomplete="off">
          <div class="palette-content" id="palette-results">
            <!-- Items injected here -->
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', paletteHTML);
  }

  const overlay = document.getElementById('palette-overlay');
  const input = document.getElementById('palette-search');
  const results = document.getElementById('palette-results');

  const ACTIONS = [
    { label: 'Go to Editor', shortcut: 'G E', action: () => window.location.href = '../../features/editor/index.html' },
    { label: 'Go to Agents Dashboard', shortcut: 'G A', action: () => window.location.href = '../../features/agents/index.html' },
    { label: 'Go to Neural Graph', shortcut: 'G N', action: () => window.location.href = '../../features/neural/index.html' },
    { label: 'Go to Artifacts', shortcut: 'G R', action: () => window.location.href = '../../features/artifacts/index.html' },
    { label: 'Go to Documentation', shortcut: 'G D', action: () => window.location.href = '../../features/docs/index.html' },
    { label: 'Go to Developer Hub', shortcut: 'G H', action: () => window.location.href = '../../features/devhub/index.html' },
    { label: 'Switch Model: Gemini 3 Pro', shortcut: 'M 1', action: () => changeModel('gemini') },
    { label: 'Switch Model: GPT-OSS 120B', shortcut: 'M 2', action: () => changeModel('gpt') },
    { label: 'Open Settings', shortcut: 'Cmd+,', action: () => window.openSettings && window.openSettings() },
    { label: 'Go Home', shortcut: 'G H', action: () => window.location.href = '../../../index.html' },
  ];

  function changeModel(model) {
    if (window.selectModel) window.selectModel(model);
    else {
      localStorage.setItem('ag_model', model);
      alert('Model switched to ' + model + '. Reloading...');
      location.reload();
    }
  }

  // Toggle Logic
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      togglePalette();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      togglePalette();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) togglePalette();
  });

  function togglePalette() {
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      input.blur();
    } else {
      overlay.classList.add('open');
      input.value = '';
      renderActions(ACTIONS);
      input.focus();
    }
  }

  // Filter Logic
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = ACTIONS.filter(item => item.label.toLowerCase().includes(query));
    renderActions(filtered);
  });

  function renderActions(items) {
    results.innerHTML = '';
    if (items.length === 0) {
      results.innerHTML = '<div style="padding:15px; text-align:center; color:#666;">No commands found</div>';
      return;
    }
    
    // Grouping could be added here, simplified for now
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'palette-item';
      el.innerHTML = `
        <span>${item.label}</span>
        ${item.shortcut ? `<span class="shortcut">${item.shortcut}</span>` : ''}
      `;
      el.onclick = () => {
        togglePalette();
        item.action();
      };
      results.appendChild(el);
    });
  }

})();

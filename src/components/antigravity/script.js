// Minimal script to load component HTML fragments and handle modal toggle

// Utility to fetch and inject HTML
function loadComponent(selector, path) {
  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .catch((err) => console.error('Failed to load', path, err));
}

// Load all components on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('#nav-container', 'nav.html');
  loadComponent('#hero-container', 'hero.html');
  loadComponent('#button-demo', 'button.html');
  loadComponent('#card-demo', 'card.html');
  loadComponent('#modal-container', 'modal.html');
  loadComponent('#footer-container', 'footer.html');
});

// Modal toggle logic (expects modal.html to contain .modal and .modal-close)
// Modal toggle logic (expects modal.html to contain .modal-overlay with the ID matching the button's data-modal-target)

document.addEventListener('click', (e) => {
  const target = e.target;
  const modalTarget = target.getAttribute('data-modal-target');
  if (modalTarget) {
    const modal = document.querySelector(modalTarget);
    if (modal) {
      modal.style.display = 'flex'; // show overlay
      modal.classList.add('open');
    }
  }
  // Close when clicking close button or overlay background
  if (target.classList.contains('modal-close') || target.classList.contains('modal-overlay')) {
    const modal = target.closest('.modal-overlay');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('open');
    }
  }
});

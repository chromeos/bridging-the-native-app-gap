/**
 *
 * @param {string} text - Text to display in snackbar
 */
export function snackbar(text) {
  const sb = document.createElement('div');
  const wrapper = document.querySelector('.snackbar-wrapper');
  sb.classList.add('snackbar');
  sb.innerHTML = `<span>${text}</span><button class="snackbar--close"><svg><use xlink:href="#close" /></svg></button>`;
  wrapper.appendChild(sb);
  setTimeout(() => {
    sb.style.transform = 'scale(1)';
  }, 10);
  sb.querySelector('button').addEventListener('click', () => remove(sb));
  setTimeout(() => remove(sb), 5000);
}

/**
 * Removes snackbar from DOM through pretty animation
 * @param {element} sb - Snackbar element
 */
function remove(sb) {
  sb.style.transform = 'scale(0)';

  setTimeout(() => sb.remove(), 20);
}

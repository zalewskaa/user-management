// Error message component

export function createErrorMessage(message) {
  const error = document.createElement('div');
  error.className = 'error-message';
  error.innerHTML = `
        <div class="error-icon">⚠️</div>
        <p>${message}</p>
    `;
  return error;
}

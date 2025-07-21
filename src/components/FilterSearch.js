// Filter and search components

export function createLanguageButton(text, isActive = false) {
  const button = document.createElement('button');
  button.className = `language-btn ${isActive ? 'active' : ''}`;
  button.textContent = text;
  return button;
}

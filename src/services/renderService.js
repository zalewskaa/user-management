// UI rendering utilities

import { createUserCard, createLanguageButton } from '../components/index.js';

/**
 * Renders user cards to the DOM
 * @param {Array} users - Array of user objects to render
 * @param {HTMLElement} container - Container element for user cards
 */
export function renderUserCards(users, container) {
  if (!container) {
    console.error('User grid element not found');
    return;
  }

  container.innerHTML = '';

  users.forEach((user) => {
    const userCard = createUserCard(user);
    container.appendChild(userCard);
  });
}

/**
 * Renders language filter buttons
 * @param {Array} users - All users array
 * @param {HTMLElement} container - Container for filter buttons
 * @param {Function} handleClick - Click handler function
 */
export function renderLanguageFilters(users, container, handleClick) {
  if (!container) {
    console.error('Language filter element not found');
    return;
  }

  const languages = [...new Set(users.map((user) => user.language))];

  // Clear existing filters
  container.innerHTML = '';

  // Create "All Languages" button
  const allButton = createLanguageButton('All Languages', true);
  allButton.setAttribute('data-language', 'all');
  allButton.addEventListener('click', handleClick);
  container.appendChild(allButton);

  // Create language-specific buttons
  languages.forEach((language) => {
    const button = createLanguageButton(language, false);
    button.setAttribute('data-language', language);
    button.addEventListener('click', handleClick);
    container.appendChild(button);
  });
}

/**
 * Updates active filter button
 * @param {HTMLElement} clickedButton - The button that was clicked
 */
export function updateActiveFilter(clickedButton) {
  // Remove active class from all buttons
  document.querySelectorAll('.language-btn').forEach((btn) => {
    btn.classList.remove('active');
  });

  // Add active class to clicked button
  clickedButton.classList.add('active');
}

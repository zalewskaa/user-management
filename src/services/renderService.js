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

  // Handle empty data state
  if (!users || users.length === 0) {
    const noDataElement = createNoDataMessage(users);
    container.appendChild(noDataElement);
    return;
  }

  users.forEach((user) => {
    const userCard = createUserCard(user);
    container.appendChild(userCard);
  });
}

/**
 * Creates a "no data" message element
 * @param {Array} users - The users array to check context
 * @returns {HTMLElement} No data message element
 */
function createNoDataMessage(users) {
  const noDataDiv = document.createElement('div');
  noDataDiv.className = 'no-data-message';

  // Get current filters to provide contextual messaging
  const searchInput = document.getElementById('searchInput');
  const currentSearch = searchInput?.value || '';
  const activeLanguageBtn = document.querySelector('.language-btn.active');
  const currentLanguage =
    activeLanguageBtn?.getAttribute('data-language') || 'all';

  let title = 'No Users Found';
  let description =
    'No users match your current search criteria. Try adjusting your filters or search terms.';

  // Provide more specific messaging based on active filters
  if (currentSearch && currentLanguage !== 'all') {
    title = 'No Matching Results';
    description = `No users found matching "${currentSearch}" in ${currentLanguage}. Try different search terms or change the language filter.`;
  } else if (currentSearch) {
    title = 'No Search Results';
    description = `No users found matching "${currentSearch}". Check your spelling or try different search terms.`;
  } else if (currentLanguage !== 'all') {
    title = 'No Users in This Language';
    description = `No users found for ${currentLanguage}. Try selecting a different language or reset filters.`;
  }

  noDataDiv.innerHTML = `
    <div class="no-data-content">
      <div class="no-data-icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="#6c757d" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="#6c757d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8 11h6" stroke="#6c757d" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h3 class="no-data-title">${title}</h3>
      <p class="no-data-description">${description}</p>
      <button class="no-data-reset-btn" onclick="resetFilters()">
        Reset All Filters
      </button>
    </div>
  `;

  return noDataDiv;
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

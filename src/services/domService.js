// DOM manipulation utilities

/**
 * Updates statistics in the DOM
 * @param {Object} stats - Statistics object
 * @param {Object} elements - DOM elements object
 */
export function updateStatsDisplay(stats, elements) {
  const { totalUsersElement, totalLanguagesElement, avgVersionElement } =
    elements;

  if (totalUsersElement) totalUsersElement.textContent = stats.totalUsers;
  if (totalLanguagesElement)
    totalLanguagesElement.textContent = stats.totalLanguages;
  if (avgVersionElement) avgVersionElement.textContent = stats.avgVersion;
}

/**
 * Shows/hides loading indicator
 * @param {HTMLElement} loadingElement - Loading element
 * @param {boolean} show - Whether to show or hide
 */
export function toggleLoading(loadingElement, show) {
  if (loadingElement) {
    loadingElement.style.display = show ? 'block' : 'none';
  }
}

/**
 * Updates load time display
 * @param {HTMLElement} loadTimeElement - Load time element
 * @param {number} startTime - Start timestamp
 */
export function updateLoadTime(loadTimeElement, startTime) {
  if (loadTimeElement) {
    const endTime = performance.now();
    loadTimeElement.textContent = `${Math.round(endTime - startTime)}ms`;
  }
}

/**
 * Shows error message in the UI
 * @param {string} message - Error message
 * @param {Function} createErrorMessage - Error message component function
 */
export function showError(message, createErrorMessage) {
  const errorMessage = createErrorMessage(message);
  const container = document.querySelector('.container');
  if (container) {
    container.appendChild(errorMessage);
  }
}

/**
 * Gets all DOM elements needed by the app
 * @returns {Object} Object containing all DOM elements
 */
export function getDOMElements() {
  return {
    loadingElement: document.getElementById('loading'),
    userGridElement: document.getElementById('userGrid'),
    searchInputElement: document.getElementById('searchInput'),
    languageFilterElement: document.getElementById('languageFilter'),
    sortSelectElement: document.getElementById('sortSelect'),
    limitSelectElement: document.getElementById('limitSelect'),
    totalUsersElement: document.getElementById('totalUsers'),
    totalLanguagesElement: document.getElementById('totalLanguages'),
    avgVersionElement: document.getElementById('avgVersion'),
    loadTimeElement: document.getElementById('loadTime'),
  };
}

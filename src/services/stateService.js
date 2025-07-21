// Application state management

/**
 * Application state object
 */
export const appState = {
  allUsers: [],
  filteredUsers: [],
  currentSort: 'name',
  currentLanguage: 'all',
  searchTerm: '',
  isLoading: false,
  pagination: {
    currentPage: 1,
    itemsPerPage: 25,
    totalPages: 0,
    totalItems: 0,
  },
};

/**
 * Updates the application state
 * @param {Object} updates - Object containing state updates
 */
export function updateState(updates) {
  Object.assign(appState, updates);
}

/**
 * Gets current filter settings from state
 * @returns {Object} Current filter settings
 */
export function getCurrentFilters() {
  return {
    searchTerm: appState.searchTerm,
    language: appState.currentLanguage,
    sortBy: appState.currentSort,
    limit: appState.currentLimit,
  };
}

/**
 * Resets application state
 */
export function resetState() {
  appState.allUsers = [];
  appState.filteredUsers = [];
  appState.currentSort = 'name';
  appState.currentLanguage = 'all';
  appState.currentLimit = 'all';
  appState.searchTerm = '';
  appState.isLoading = false;
}

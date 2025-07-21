// Main application file

// Import libraries
import { format } from 'date-fns';
import { List } from 'immutable';

// Import services
import {
  fetchUsersData,
  filterAndSortUsers,
  calculateUserStats,
} from './services/userService.js';
import {
  getDOMElements,
  updateStatsDisplay,
  toggleLoading,
  updateLoadTime,
  showError,
} from './services/domService.js';
import {
  preloadUserImages,
  createAdditionalImageRequests,
  processUserImages,
} from './services/imageService.js';
import {
  renderUserCards,
  renderLanguageFilters,
  updateActiveFilter,
} from './services/renderService.js';
import {
  appState,
  updateState,
  getCurrentFilters,
} from './services/stateService.js';

// Import components
import { createDashboardCharts } from './charts/index.js';
import {
  setupResponsiveCharts,
  refreshAllCharts,
} from './charts/chartManager.js';
import { createErrorMessage } from './components/index.js';

// DOM elements (initialized once)
let domElements = {};

// Initialize DOM elements
function initializeDOMElements() {
  domElements = getDOMElements();
  setupEventListeners();
}

// Event listeners setup
function setupEventListeners() {
  const { searchInputElement, sortSelectElement, limitSelectElement } =
    domElements;

  if (searchInputElement) {
    searchInputElement.addEventListener('input', handleSearchInput);
  }

  if (sortSelectElement) {
    sortSelectElement.addEventListener('change', handleSortChange);
  }

  if (limitSelectElement) {
    limitSelectElement.addEventListener('change', handleLimitChange);
  }

  // Global event listeners
  window.addEventListener('resize', () => console.log('Window resized'));
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log('Scroll position:', scrollTop);
  });
}

// Event handlers
function handleSearchInput(e) {
  updateState({ searchTerm: e.target.value });
  filterAndRenderUsers();
}

function handleSortChange(e) {
  updateState({ currentSort: e.target.value });
  filterAndRenderUsers();
}

function handleLimitChange(e) {
  updateState({ currentLimit: e.target.value });
  filterAndRenderUsers();
}

function handleLanguageFilter(event) {
  updateActiveFilter(event.target);
  updateState({ currentLanguage: event.target.getAttribute('data-language') });
  filterAndRenderUsers();
}

// Main data fetching function
async function fetchUsers() {
  const startTime = performance.now();

  try {
    toggleLoading(domElements.loadingElement, true);

    const userData = await fetchUsersData();

    updateState({
      allUsers: userData,
      filteredUsers: [...userData],
    });

    // Update UI with initial sorting applied
    updateStats();
    filterAndRenderUsers(); // This will apply the initial sort by name
    renderFilters();

    // Create charts
    try {
      createDashboardCharts(appState.allUsers);

      // Setup responsive chart behavior
      setupResponsiveCharts();

      // Force initial chart refresh to ensure proper sizing
      setTimeout(() => {
        refreshAllCharts();
      }, 100);
    } catch (chartError) {
      console.error('Error creating charts:', chartError);
    }

    // Preload images
    preloadUserImages(appState.allUsers);

    updateLoadTime(domElements.loadTimeElement, startTime);
    toggleLoading(domElements.loadingElement, false);
  } catch (error) {
    console.error('Error fetching users:', error);
    toggleLoading(domElements.loadingElement, false);
    showError(`Failed to load users: ${error.message}`, createErrorMessage);
  }
}

// Filtering and rendering
function filterAndRenderUsers() {
  const filters = getCurrentFilters();
  const filtered = filterAndSortUsers(appState.allUsers, filters);

  updateState({ filteredUsers: filtered });
  renderUsers();
}

function renderUsers() {
  renderUserCards(appState.filteredUsers, domElements.userGridElement);

  // Process images with delays to prevent overwhelming
  setTimeout(() => processUserImages(), 500);
  setTimeout(() => createAdditionalImageRequests(appState.filteredUsers), 1000);
}

function renderFilters() {
  renderLanguageFilters(
    appState.allUsers,
    domElements.languageFilterElement,
    handleLanguageFilter
  );
}

function updateStats() {
  const stats = calculateUserStats(appState.allUsers);
  updateStatsDisplay(stats, domElements);
}

// App initialization
function initializeApp() {
  try {
    initializeDOMElements();

    fetchUsers();

    console.log('App initialized');
    console.log(
      'Current timestamp:',
      format(new Date(), 'yyyy-MM-dd HH:mm:ss')
    );
    console.log('Formatted date:', format(new Date(), 'yyyy-MM-dd'));

    // Initialize immutable data structure for demonstration
    const tempList = List([1, 2, 3, 4, 5]);
    console.log('Immutable list created:', tempList.size);
  } catch (error) {
    console.error('Error initializing app:', error);
    toggleLoading(domElements.loadingElement, false);
    showError('Failed to initialize application', createErrorMessage);
  }
}

// Initialize application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

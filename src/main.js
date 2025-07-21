// Main application file

// Import libraries
import { format } from 'date-fns';
import { List } from 'immutable';

// Import utilities
import { debounce } from './utils.js';

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
import { createErrorMessage, createPagination } from './components/index.js';

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

  if (domElements.searchInputElement) {
    domElements.searchInputElement.addEventListener(
      'input',
      handleSearchInputWithFeedback
    );
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

// Enhanced search handler with immediate state update and visual feedback
function handleSearchInputWithFeedback(e) {
  const searchTerm = e.target.value;

  // Update state immediately for UI responsiveness and reset pagination
  updateState({
    searchTerm,
    pagination: {
      ...appState.pagination,
      currentPage: 1, // Reset to first page when searching
    },
  });

  // Add visual feedback to indicate search is pending
  const searchInput = e.target;
  searchInput.classList.add('searching');

  // The actual filtering will be debounced
  debouncedFilterAndRender(searchInput);
} // Debounced filter function that removes visual feedback when done
const debouncedFilterAndRender = debounce((searchInput) => {
  filterAndRenderUsers();
  searchInput.classList.remove('searching');
}, 300);

// Create debounced version of search handler for better performance
const debouncedSearchHandler = debounce(handleSearchInput, 300);

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

// Global function to reset all filters (called from no data message)
window.resetFilters = function () {
  // Reset all filter states including pagination
  updateState({
    searchTerm: '',
    currentLanguage: 'all',
    currentSort: 'name',
    pagination: {
      currentPage: 1,
      itemsPerPage: 25,
      totalPages: 0,
      totalItems: 0,
    },
  });

  // Reset form elements
  if (domElements.searchInputElement) {
    domElements.searchInputElement.value = '';
  }
  if (domElements.sortSelectElement) {
    domElements.sortSelectElement.value = 'name';
  }

  // Reset language filter buttons
  const languageButtons = document.querySelectorAll('.language-btn');
  languageButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-language') === 'all') {
      btn.classList.add('active');
    }
  });

  // Re-render with all users
  filterAndRenderUsers();
};

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

  // Add pagination info to filters
  const paginationFilters = {
    ...filters,
    page: appState.pagination.currentPage,
    itemsPerPage: appState.pagination.itemsPerPage,
  };

  const result = filterAndSortUsers(appState.allUsers, paginationFilters);

  updateState({
    filteredUsers: result.users,
    pagination: {
      ...appState.pagination,
      ...result.pagination,
    },
  });

  renderUsers();
  renderPagination();
}

function renderUsers() {
  renderUserCards(appState.filteredUsers, domElements.userGridElement);

  // Process images with delays to prevent overwhelming
  setTimeout(() => processUserImages(), 500);
  setTimeout(() => createAdditionalImageRequests(appState.filteredUsers), 1000);
}

function renderPagination() {
  if (!domElements.paginationSectionElement) return;

  // Clear existing pagination
  domElements.paginationSectionElement.innerHTML = '';

  // Create new pagination if needed
  const paginationElement = createPagination(
    appState.pagination,
    handlePageChange
  );
  if (paginationElement) {
    domElements.paginationSectionElement.appendChild(paginationElement);
  }
}

function handlePageChange(newPage, newItemsPerPage = null) {
  // Update pagination state
  const updates = {
    pagination: {
      ...appState.pagination,
      currentPage: newPage,
    },
  };

  // Update items per page if provided
  if (newItemsPerPage !== null) {
    updates.pagination.itemsPerPage = newItemsPerPage;
  }

  updateState(updates);
  filterAndRenderUsers();
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

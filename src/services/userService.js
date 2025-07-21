// User data service

/**
 * Filter users to get only unique users by ID
 * @param {Array} users - Array of user objects
 * @returns {Array} Array of unique users
 */
function getUniqueUsersById(users) {
  const uniqueUsers = new Map();

  users.forEach((user) => {
    // Use ID as the unique identifier
    if (!uniqueUsers.has(user.id)) {
      uniqueUsers.set(user.id, user);
    }
  });

  return Array.from(uniqueUsers.values());
}

/**
 * Fetches user data from the API and returns only unique users
 * @returns {Promise<Array>} Array of unique user objects
 */
export async function fetchUsersData() {
  const response = await fetch(
    'https://microsoftedge.github.io/Demos/json-dummy-data/128KB.json'
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const userData = await response.json();

  if (!Array.isArray(userData)) {
    throw new Error('Invalid data format: expected array');
  }

  // Filter to unique users by ID before returning
  const uniqueUsers = getUniqueUsersById(userData);

  console.log(
    `Fetched ${userData.length} total users, filtered to ${uniqueUsers.length} unique users`
  );

  return uniqueUsers;
}

/**
 * Filters and sorts users based on criteria with pagination
 * @param {Array} users - Array of user objects
 * @param {Object} filters - Filter criteria
 * @returns {Object} Object containing filtered users and pagination info
 */
export function filterAndSortUsers(users, filters) {
  const { searchTerm, language, sortBy, page = 1, itemsPerPage = 25 } = filters;

  let filtered = [...users];

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply language filter
  if (language !== 'all') {
    filtered = filtered.filter((user) => user.language === language);
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'language':
        return a.language.localeCompare(b.language);
      case 'version':
        return b.version - a.version;
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filtered.slice(startIndex, endIndex);

  return {
    users: paginatedUsers,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    },
  };
}

/**
 * Calculate pagination information
 * @param {number} totalItems - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} itemsPerPage - Items per page
 * @returns {Object} Pagination information
 */
export function calculatePagination(totalItems, currentPage, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  return {
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: validCurrentPage < totalPages,
    hasPrevPage: validCurrentPage > 1,
    startIndex: (validCurrentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(validCurrentPage * itemsPerPage, totalItems),
  };
}

/**
 * Calculates statistics from user data
 * @param {Array} users - Array of user objects
 * @returns {Object} Statistics object
 */
export function calculateUserStats(users) {
  if (!users || users.length === 0) {
    return {
      totalUsers: 0,
      totalLanguages: 0,
      avgVersion: 0,
    };
  }

  const totalUsers = users.length;

  const languages = [
    ...new Set(users.map((user) => user.language).filter(Boolean)),
  ];
  const totalLanguages = languages.length;

  const validVersions = users.filter(
    (user) => user.version && !isNaN(user.version)
  );
  const totalVersion = validVersions.reduce(
    (sum, user) => sum + user.version,
    0
  );
  const avgVersion =
    validVersions.length > 0 ? totalVersion / validVersions.length : 0;

  return {
    totalUsers,
    totalLanguages,
    avgVersion: parseFloat(avgVersion.toFixed(2)),
  };
}

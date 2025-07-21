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
 * Filters and sorts users based on criteria
 * @param {Array} users - Array of user objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered and sorted users
 */
export function filterAndSortUsers(users, filters) {
  const { searchTerm, language, sortBy, limit } = filters;

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

  // Apply limit
  if (limit !== 'all') {
    filtered = filtered.slice(0, parseInt(limit));
  }

  return filtered;
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

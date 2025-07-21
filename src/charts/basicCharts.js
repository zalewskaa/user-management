// Basic chart types

import Chart from 'chart.js/auto';

// Chart instances storage
const chartInstances = new Map();

/**
 * Base chart creation with skeleton loading
 * @param {string} containerId - Chart container ID
 * @param {Object} config - Chart.js configuration
 * @param {string} skeletonType - Type of skeleton to show
 * @returns {Promise<Chart>} Chart instance
 */
async function createChartWithSkeleton(containerId, config) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);

  return chart;
}

/**
 * Create user language distribution pie chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createLanguageChart(containerId, data) {
  const languageCounts = {};
  data.forEach((user) => {
    languageCounts[user.language] = (languageCounts[user.language] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(languageCounts),
    datasets: [
      {
        label: 'Users by Language',
        data: Object.values(languageCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 2,
      },
    ],
  };

  const config = {
    type: 'pie',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'User Language Distribution',
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'pie');
}

/**
 * Create version distribution bar chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createVersionChart(containerId, data) {
  const versionRanges = {
    '1.0-2.0': 0,
    '2.1-3.0': 0,
    '3.1-4.0': 0,
    '4.1-5.0': 0,
    '5.1+': 0,
  };

  data.forEach((user) => {
    if (user.version >= 1.0 && user.version <= 2.0) versionRanges['1.0-2.0']++;
    else if (user.version > 2.0 && user.version <= 3.0)
      versionRanges['2.1-3.0']++;
    else if (user.version > 3.0 && user.version <= 4.0)
      versionRanges['3.1-4.0']++;
    else if (user.version > 4.0 && user.version <= 5.0)
      versionRanges['4.1-5.0']++;
    else versionRanges['5.1+']++;
  });

  const chartData = {
    labels: Object.keys(versionRanges),
    datasets: [
      {
        label: 'Users by Version Range',
        data: Object.values(versionRanges),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Version Distribution',
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'bar');
}

/**
 * Create performance metrics radar chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createPerformanceChart(containerId, data) {
  const performanceData = data.map((user) => ({
    name: user.name,
    version: user.version,
    language: user.language,
  }));

  const chartData = {
    labels: performanceData.map((user) => user.name),
    datasets: [
      {
        label: 'Version Performance',
        data: performanceData.map((user) => user.version),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const config = {
    type: 'radar',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'User Performance Metrics',
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 5,
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'radar');
}

// Export chart instances for cleanup
export { chartInstances };

// Advanced comparison and analysis charts

import Chart from 'chart.js/auto';

// Chart instances storage
const chartInstances = new Map();

/**
 * Utility function to calculate mean by property
 */
function meanBy(array, property) {
  const sum = array.reduce((acc, item) => acc + item[property], 0);
  return array.length > 0 ? sum / array.length : 0;
}

/**
 * Base chart creation with skeleton loading
 */
async function createChartWithSkeleton(containerId, config) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

/**
 * Create comparison chart between two datasets
 * @param {string} containerId - Chart container ID
 * @param {Array} data1 - First dataset
 * @param {Array} data2 - Second dataset
 * @returns {Promise<Chart>} Chart instance
 */
export async function createComparisonChart(containerId, data1, data2) {
  const metrics = {
    avgVersion: [meanBy(data1, 'version'), meanBy(data2, 'version')],
    totalUsers: [data1.length, data2.length],
    uniqueLanguages: [
      new Set(data1.map((u) => u.language)).size,
      new Set(data2.map((u) => u.language)).size,
    ],
  };

  const chartData = {
    labels: ['Average Version', 'Total Users', 'Unique Languages'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [
          metrics.avgVersion[0],
          metrics.totalUsers[0],
          metrics.uniqueLanguages[0],
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
      {
        label: 'Dataset 2',
        data: [
          metrics.avgVersion[1],
          metrics.totalUsers[1],
          metrics.uniqueLanguages[1],
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
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
          text: 'Dataset Comparison Analysis',
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'bar');
}

/**
 * Create complex multi-dataset chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createComplexChart(containerId, data) {
  const processedData = data.slice(0, 10).map((user, index) => ({
    ...user,
    score: Math.random() * 100,
    rank: index + 1,
    engagement: Math.random() * 50 + 50,
  }));

  const chartData = {
    labels: processedData.map((user) => user.name),
    datasets: [
      {
        label: 'Version',
        data: processedData.map((user) => user.version),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y',
        type: 'line',
        tension: 0.4,
      },
      {
        label: 'Score',
        data: processedData.map((user) => user.score),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        yAxisID: 'y1',
        type: 'bar',
      },
      {
        label: 'Engagement',
        data: processedData.map((user) => user.engagement),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y1',
        type: 'line',
        tension: 0.4,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Users',
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Version',
          },
          max: 6,
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Score / Engagement',
          },
          max: 100,
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Complex User Analysis Dashboard',
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'bar');
}

/**
 * Create language comparison donut chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createLanguageComparisonChart(containerId, data) {
  const languageCounts = {};
  data.forEach((user) => {
    languageCounts[user.language] = (languageCounts[user.language] || 0) + 1;
  });

  const total = data.length;
  const chartData = {
    labels: Object.keys(languageCounts),
    datasets: [
      {
        label: 'Language Distribution',
        data: Object.values(languageCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6B6B',
          '#4ECDC4',
        ],
        borderWidth: 3,
        borderColor: '#fff',
        hoverBorderWidth: 4,
      },
    ],
  };

  const config = {
    type: 'doughnut',
    data: chartData,
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        title: {
          display: true,
          text: 'Programming Language Distribution',
        },
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${context.label}: ${context.parsed} users (${percentage}%)`;
            },
          },
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'pie');
}

// Export chart instances and utilities
export { chartInstances, meanBy };

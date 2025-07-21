// Timeline and activity charts

import Chart from 'chart.js/auto';
import { format, subDays } from 'date-fns';

// Chart instances storage
const chartInstances = new Map();

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
 * Create user activity timeline chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createTimelineChart(containerId, data) {
  const timelineData = {};

  // Generate realistic timeline data
  data.forEach((user, index) => {
    const daysAgo = Math.floor(Math.random() * 30); // Last 30 days
    const date = format(subDays(new Date(), daysAgo), 'yyyy-MM-dd');
    timelineData[date] = (timelineData[date] || 0) + 1;
  });

  const sortedDates = Object.keys(timelineData).sort();
  const chartData = {
    labels: sortedDates.map((date) => format(new Date(date), 'MMM dd')),
    datasets: [
      {
        label: 'User Activity',
        data: sortedDates.map((date) => timelineData[date]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const config = {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Users',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Date',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'User Activity Timeline (Last 30 Days)',
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'line');
}

/**
 * Create animated activity chart
 * @param {string} containerId - Chart container ID
 * @param {Array} data - User data array
 * @returns {Promise<Chart>} Chart instance
 */
export async function createAnimatedChart(containerId, data) {
  const chartData = {
    labels: data.slice(0, 8).map((user) => user.name),
    datasets: [
      {
        label: 'User Engagement Score',
        data: data.slice(0, 8).map(() => Math.floor(Math.random() * 100) + 1),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#36A2EB',
        ],
        borderWidth: 2,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart',
        delay: (context) => {
          return context.dataIndex * 100;
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Engagement Score',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'User Engagement Animation',
        },
      },
    },
  };

  return await createChartWithSkeleton(containerId, config, 'bar');
}

// Export chart instances
export { chartInstances };

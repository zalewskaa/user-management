// Main chart entry point and dashboard functionality

import {
  createLanguageChart,
  createVersionChart,
  createPerformanceChart,
} from './basicCharts.js';
import { createTimelineChart, createAnimatedChart } from './timelineCharts.js';
import {
  createComparisonChart,
  createComplexChart,
  createLanguageComparisonChart,
} from './analysisCharts.js';
import {
  destroyChart,
  destroyAllCharts,
  updateChart,
  resizeAllCharts,
  downloadChart,
  getChartStats,
} from './chartManager.js';

/**
 * Create all dashboard charts with loading states
 * @param {Array} data - User data array
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} Created charts object
 */
export async function createDashboardCharts(data, options = {}) {
  console.log('Creating dashboard charts with data:', data.length, 'users');
  const charts = {};

  // Create charts in parallel for better performance
  const chartPromises = [];

  if (document.getElementById('languageChart')) {
    console.log('Creating language chart...');
    chartPromises.push(
      createLanguageChart('languageChart', data)
        .then((chart) => {
          console.log('Language chart created:', !!chart);
          charts.language = chart;
        })
        .catch((error) => {
          console.error('Error creating language chart:', error);
        })
    );
  }

  if (document.getElementById('versionChart')) {
    console.log('Creating version chart...');
    chartPromises.push(
      createVersionChart('versionChart', data)
        .then((chart) => {
          console.log('Version chart created:', !!chart);
          charts.version = chart;
        })
        .catch((error) => {
          console.error('Error creating version chart:', error);
        })
    );
  }

  if (document.getElementById('timelineChart')) {
    console.log('Creating timeline chart...');
    chartPromises.push(
      createTimelineChart('timelineChart', data)
        .then((chart) => {
          console.log('Timeline chart created:', !!chart);
          charts.timeline = chart;
        })
        .catch((error) => {
          console.error('Error creating timeline chart:', error);
        })
    );
  }

  if (document.getElementById('performanceChart')) {
    console.log('Creating performance chart...');
    chartPromises.push(
      createPerformanceChart('performanceChart', data)
        .then((chart) => {
          console.log('Performance chart created:', !!chart);
          charts.performance = chart;
        })
        .catch((error) => {
          console.error('Error creating performance chart:', error);
        })
    );
  }

  // Wait for all charts to complete
  await Promise.all(chartPromises);
  console.log('All charts created:', Object.keys(charts));

  return charts;
}

/**
 * Refresh all dashboard charts with new data
 * @param {Array} data - New user data array
 * @returns {Promise<Object>} Updated charts object
 */
export async function refreshDashboardCharts(data) {
  // Destroy existing charts
  destroyAllCharts();

  // Create new charts with updated data
  return await createDashboardCharts(data);
}

/**
 * Create advanced analytics dashboard
 * @param {Array} data - User data array
 * @param {string} containerId - Container ID for the dashboard
 * @returns {Promise<Object>} Created charts object
 */
export async function createAnalyticsDashboard(
  data,
  containerId = 'analytics-dashboard'
) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const charts = {};

  // Split data for comparison
  const midpoint = Math.floor(data.length / 2);
  const data1 = data.slice(0, midpoint);
  const data2 = data.slice(midpoint);

  // Create analytics charts
  if (document.getElementById('comparisonChart')) {
    charts.comparison = await createComparisonChart(
      'comparisonChart',
      data1,
      data2
    );
  }

  if (document.getElementById('complexChart')) {
    charts.complex = await createComplexChart('complexChart', data);
  }

  if (document.getElementById('languageComparisonChart')) {
    charts.languageComparison = await createLanguageComparisonChart(
      'languageComparisonChart',
      data
    );
  }

  if (document.getElementById('animatedChart')) {
    charts.animated = await createAnimatedChart('animatedChart', data);
  }

  return charts;
}

/**
 * Export all dashboard charts
 * @param {Array} chartIds - Array of chart container IDs
 * @param {string} format - Image format ('png', 'jpeg', 'webp')
 */
export function exportDashboardCharts(
  chartIds = [
    'languageChart',
    'versionChart',
    'timelineChart',
    'performanceChart',
  ],
  format = 'png'
) {
  chartIds.forEach((chartId) => {
    const stats = getChartStats(chartId);
    if (stats) {
      const filename = `${chartId}_${stats.type}_chart`;
      downloadChart(chartId, filename, format);
    }
  });
}

// Re-export all chart creation functions for convenience
export {
  // Basic charts
  createLanguageChart,
  createVersionChart,
  createPerformanceChart,

  // Timeline charts
  createTimelineChart,
  createAnimatedChart,

  // Analysis charts
  createComparisonChart,
  createComplexChart,
  createLanguageComparisonChart,

  // Management functions
  destroyChart,
  destroyAllCharts,
  updateChart,
  resizeAllCharts,
  downloadChart,
  getChartStats,
};

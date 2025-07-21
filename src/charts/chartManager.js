// Chart management and utility functions

import { chartInstances as basicChartInstances } from './basicCharts.js';
import { chartInstances as timelineChartInstances } from './timelineCharts.js';
import { chartInstances as analysisChartInstances } from './analysisCharts.js';

// Combine all chart instances
const allChartInstances = new Map();

/**
 * Register chart instance from any module
 * @param {string} containerId - Chart container ID
 * @param {Chart} chartInstance - Chart.js instance
 */
export function registerChart(containerId, chartInstance) {
  allChartInstances.set(containerId, chartInstance);
}

/**
 * Get chart instance by container ID
 * @param {string} containerId - Chart container ID
 * @returns {Chart|null} Chart instance or null
 */
export function getChart(containerId) {
  return (
    allChartInstances.get(containerId) ||
    basicChartInstances.get(containerId) ||
    timelineChartInstances.get(containerId) ||
    analysisChartInstances.get(containerId) ||
    null
  );
}

/**
 * Update chart data
 * @param {string} containerId - Chart container ID
 * @param {Array} newData - New data array
 * @param {number} datasetIndex - Dataset index to update (default: 0)
 */
export function updateChart(containerId, newData, datasetIndex = 0) {
  const chart = getChart(containerId);
  if (!chart) return false;

  if (chart.data.datasets[datasetIndex]) {
    chart.data.datasets[datasetIndex].data = newData;
    chart.update('none'); // No animation for updates
    return true;
  }
  return false;
}

/**
 * Destroy chart and clean up resources
 * @param {string} containerId - Chart container ID
 */
export function destroyChart(containerId) {
  const chart = getChart(containerId);
  if (chart) {
    chart.destroy();

    // Remove from all possible instances
    allChartInstances.delete(containerId);
    basicChartInstances.delete(containerId);
    timelineChartInstances.delete(containerId);
    analysisChartInstances.delete(containerId);

    return true;
  }
  return false;
}

/**
 * Destroy all charts
 */
export function destroyAllCharts() {
  const allContainerIds = [
    ...allChartInstances.keys(),
    ...basicChartInstances.keys(),
    ...timelineChartInstances.keys(),
    ...analysisChartInstances.keys(),
  ];

  allContainerIds.forEach((containerId) => {
    destroyChart(containerId);
  });
}

/**
 * Resize chart to fit container
 * @param {string} containerId - Chart container ID
 */
export function resizeChart(containerId) {
  const chart = getChart(containerId);
  if (!chart) return false;

  try {
    // Ensure the container is visible and has dimensions
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container not found: ${containerId}`);
      return false;
    }

    // Check if container has valid dimensions
    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn(`Container has zero dimensions: ${containerId}`);
      // Try to force a reflow
      container.style.display = 'block';
      container.style.width = '100%';
      container.style.height = '400px'; // Fallback height
    }

    // Force Chart.js to recalculate dimensions
    chart.resize();

    // Additional update to ensure proper rendering
    chart.update('none');

    return true;
  } catch (error) {
    console.error(`Error resizing chart ${containerId}:`, error);
    return false;
  }
}

/**
 * Resize all charts
 */
export function resizeAllCharts() {
  // Get unique container IDs from all chart instances
  const allContainerIds = new Set([
    ...allChartInstances.keys(),
    ...basicChartInstances.keys(),
    ...timelineChartInstances.keys(),
    ...analysisChartInstances.keys(),
  ]);

  let successCount = 0;
  let totalCount = allContainerIds.size;

  allContainerIds.forEach((containerId) => {
    if (resizeChart(containerId)) {
      successCount++;
    }
  });

  console.log(`Resized ${successCount}/${totalCount} charts`);
  return { successCount, totalCount };
}

/**
 * Force refresh all charts (useful for responsive issues)
 */
export function refreshAllCharts() {
  // Wait for DOM to be ready
  requestAnimationFrame(() => {
    setTimeout(() => {
      resizeAllCharts();
    }, 100);
  });
}

/**
 * Setup responsive chart behavior
 */
export function setupResponsiveCharts() {
  // Add window resize listener
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      refreshAllCharts();
    }, 250); // Debounce resize events
  });

  // Add visibility change listener for when tabs become active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(() => {
        refreshAllCharts();
      }, 100);
    }
  });

  // Handle orientation changes on mobile devices
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      refreshAllCharts();
    }, 500);
  });
}

/**
 * Fix common chart rendering issues
 * @param {string} containerId - Chart container ID
 */
export function fixChartRendering(containerId) {
  const chart = getChart(containerId);
  const container = document.getElementById(containerId);

  if (!chart || !container) return false;

  try {
    // Force container to have proper dimensions
    const parent = container.parentElement;
    if (parent) {
      parent.style.display = 'block';
      parent.style.width = '100%';
    }

    // Ensure canvas has proper attributes
    const canvas = container.querySelector('canvas');
    if (canvas) {
      canvas.style.display = 'block';
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
    }

    // Force chart to recalculate
    chart.resize();
    chart.update('none');

    return true;
  } catch (error) {
    console.error(`Error fixing chart rendering for ${containerId}:`, error);
    return false;
  }
}

/**
 * Export chart as image
 * @param {string} containerId - Chart container ID
 * @param {string} format - Image format ('png', 'jpeg', 'webp')
 * @returns {string|null} Base64 image data URL or null
 */
export function exportChart(containerId, format = 'png') {
  const chart = getChart(containerId);
  if (chart) {
    return chart.toBase64Image(`image/${format}`, 1.0);
  }
  return null;
}

/**
 * Download chart as image file
 * @param {string} containerId - Chart container ID
 * @param {string} filename - Download filename (without extension)
 * @param {string} format - Image format ('png', 'jpeg', 'webp')
 */
export function downloadChart(containerId, filename = 'chart', format = 'png') {
  const imageData = exportChart(containerId, format);
  if (imageData) {
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = imageData;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }
  return false;
}

/**
 * Get chart statistics
 * @param {string} containerId - Chart container ID
 * @returns {Object|null} Chart statistics or null
 */
export function getChartStats(containerId) {
  const chart = getChart(containerId);
  if (!chart) return null;

  const datasets = chart.data.datasets;
  const labels = chart.data.labels;

  return {
    type: chart.config.type,
    datasetCount: datasets.length,
    labelCount: labels ? labels.length : 0,
    totalDataPoints: datasets.reduce(
      (sum, dataset) => sum + (dataset.data?.length || 0),
      0
    ),
    hasAnimation: !!chart.options.animation,
    isResponsive: !!chart.options.responsive,
  };
}

/**
 * Toggle chart animation
 * @param {string} containerId - Chart container ID
 * @param {boolean} enabled - Enable or disable animation
 */
export function toggleChartAnimation(containerId, enabled) {
  const chart = getChart(containerId);
  if (chart) {
    chart.options.animation = enabled ? { duration: 1000 } : false;
    chart.update();
    return true;
  }
  return false;
}

/**
 * Update chart colors
 * @param {string} containerId - Chart container ID
 * @param {Array} colors - Array of color strings
 * @param {number} datasetIndex - Dataset index to update (default: 0)
 */
export function updateChartColors(containerId, colors, datasetIndex = 0) {
  const chart = getChart(containerId);
  if (!chart || !chart.data.datasets[datasetIndex]) return false;

  const dataset = chart.data.datasets[datasetIndex];
  if (Array.isArray(dataset.backgroundColor)) {
    dataset.backgroundColor = colors;
    dataset.borderColor = colors;
  } else {
    dataset.backgroundColor = colors[0] || colors;
    dataset.borderColor = colors[0] || colors;
  }

  chart.update();
  return true;
}

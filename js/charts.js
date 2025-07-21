// Chart utilities

// Import libraries
import Chart from 'chart.js/auto';
import { format, subDays } from 'date-fns';

// Utility function to calculate mean by property
function meanBy(array, property) {
  const sum = array.reduce((acc, item) => acc + item[property], 0);
  return array.length > 0 ? sum / array.length : 0;
}

// Chart instances storage
const chartInstances = new Map();

// Create user language distribution chart
export function createLanguageChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

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

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Create version distribution chart
export function createVersionChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

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

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Create user activity timeline chart
export function createTimelineChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

  const timelineData = {};
  data.forEach((user) => {
    const date = format(
      subDays(new Date(), Math.floor(Math.random() * 365)),
      'yyyy-MM-dd'
    );
    timelineData[date] = (timelineData[date] || 0) + 1;
  });

  const sortedDates = Object.keys(timelineData).sort();
  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'User Activity',
        data: sortedDates.map((date) => timelineData[date]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
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
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'User Activity Timeline',
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Create performance metrics chart
export function createPerformanceChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

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
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
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
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Create comparison chart
export function createComparisonChart(containerId, data1, data2) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

  const chartData = {
    labels: ['Dataset 1', 'Dataset 2'],
    datasets: [
      {
        label: 'Average Version',
        data: [meanBy(data1, 'version'), meanBy(data2, 'version')],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
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
          text: 'Dataset Comparison',
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Update chart data
export function updateChart(containerId, newData) {
  const chart = chartInstances.get(containerId);
  if (!chart) return;

  chart.data.datasets[0].data = newData;
  chart.update();
}

// Destroy chart
export function destroyChart(containerId) {
  const chart = chartInstances.get(containerId);
  if (chart) {
    chart.destroy();
    chartInstances.delete(containerId);
  }
}

// Create multiple charts
export function createDashboardCharts(data) {
  const charts = {};

  if (document.getElementById('languageChart')) {
    charts.language = createLanguageChart('languageChart', data);
  }

  if (document.getElementById('versionChart')) {
    charts.version = createVersionChart('versionChart', data);
  }

  if (document.getElementById('timelineChart')) {
    charts.timeline = createTimelineChart('timelineChart', data);
  }

  if (document.getElementById('performanceChart')) {
    charts.performance = createPerformanceChart('performanceChart', data);
  }

  return charts;
}

// Complex chart with multiple datasets
export function createComplexChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

  const processedData = data.map((user) => ({
    ...user,
    processed: true,
    score: Math.random() * 100,
    rank: Math.floor(Math.random() * 1000),
  }));

  const chartData = {
    labels: processedData.map((user) => user.name),
    datasets: [
      {
        label: 'Version',
        data: processedData.map((user) => user.version),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Score',
        data: processedData.map((user) => user.score),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        yAxisID: 'y1',
      },
    ],
  };

  const config = {
    type: 'line',
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
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Score',
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Complex User Analysis',
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Chart with animations
export function createAnimatedChart(containerId, data) {
  const ctx = document.getElementById(containerId);
  if (!ctx) return null;

  const chartData = {
    labels: data.map((user) => user.name),
    datasets: [
      {
        label: 'Animated Data',
        data: data.map((user) => user.version),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
      },
      plugins: {
        title: {
          display: true,
          text: 'Animated Chart',
        },
      },
    },
  };

  const chart = new Chart(ctx, config);
  chartInstances.set(containerId, chart);
  return chart;
}

// Export chart instances for cleanup
export { chartInstances };

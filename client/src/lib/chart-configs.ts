import { ChartConfiguration } from "chart.js";

export const defaultChartOptions: Partial<ChartConfiguration['options']> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(31, 31, 31, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
};

export const fullscreenChartOptions: Partial<ChartConfiguration['options']> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: 'white',
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(31, 31, 31, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      display: true,
      ticks: {
        color: 'white',
        maxTicksLimit: 10,
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    y: {
      display: true,
      ticks: {
        color: 'white',
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
};

export const pieChartOptions: Partial<ChartConfiguration['options']> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right',
      labels: {
        color: 'white',
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(31, 31, 31, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
    },
  },
};

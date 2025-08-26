// Central chart data generation utilities for serverless endpoints.
// Keep outputs small; heavy computation can be moved to edge caching later.

interface ChartSeries {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

interface ChartPayload {
  title: string;
  labels: string[];
  datasets: ChartSeries[];
  meta?: Record<string, any>;
}

const palette = [
  '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#ea580c', '#0891b2', '#4f46e5'
];

function randomSeeded(len: number, seed: number) {
  const arr: number[] = [];
  let x = seed;
  for (let i = 0; i < len; i++) {
    x = (x * 9301 + 49297) % 233280;
    arr.push(Math.round((x / 233280) * 100));
  }
  return arr;
}

export function makeSectorChart(sector: string): ChartPayload {
  const labels = Array.from({ length: 8 }, (_, i) => `Q${i + 1}`);
  const baseSeed = sector.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 1000;
  const seriesCount = 1 + (baseSeed % 3);
  const datasets: ChartSeries[] = Array.from({ length: seriesCount }, (_, i) => {
    const data = randomSeeded(labels.length, baseSeed + i * 17);
    return {
      label: `${sector} Metric ${i + 1}`,
      data,
      backgroundColor: palette[(baseSeed + i) % palette.length] + '55',
      borderColor: palette[(baseSeed + i) % palette.length]
    };
  });
  return {
    title: `${sector} Quarterly Performance`,
    labels,
    datasets,
    meta: { sector, generatedAt: new Date().toISOString() }
  };
}

export function listSectors() {
  return ['Agriculture', 'Energy', 'Finance', 'Health', 'Education', 'Transport', 'Technology'];
}

export function makeOverview(): ChartPayload {
  const sectors = listSectors();
  const labels = sectors;
  return {
    title: 'Sector Overview Index',
    labels,
    datasets: [
      {
        label: 'Index',
        data: labels.map((_, i) => 50 + (i * 7) % 40),
        backgroundColor: '#2563eb55',
        borderColor: '#2563eb'
      }
    ]
  };
}

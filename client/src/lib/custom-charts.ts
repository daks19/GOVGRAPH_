import { ChartData } from "@shared/schema";

const STORAGE_KEY = 'govgraph-custom-charts';

export function getCustomCharts(): ChartData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom charts:', error);
    return [];
  }
}

export function saveCustomChart(chart: ChartData): void {
  try {
    const existing = getCustomCharts();
    const updated = [...existing, chart];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('customChartsUpdated'));
  } catch (error) {
    console.error('Error saving custom chart:', error);
  }
}

export function getCustomChartsBySector(sector: string): ChartData[] {
  return getCustomCharts().filter(chart => chart.sector === sector);
}

export function deleteCustomChart(chartId: string): void {
  try {
    const existing = getCustomCharts();
    const filtered = existing.filter(chart => chart.id !== chartId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting custom chart:', error);
  }
}

export function generateChartId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function clearAllCustomCharts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing custom charts:', error);
  }
}
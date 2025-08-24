import { apiRequest } from "./queryClient";

export interface WorldBankIndicator {
  indicator: {
    id: string;
    value: string;
  };
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  value: number | null;
  decimal: number;
}

export async function fetchWorldBankData(indicator: string, countries = "all", years = "2020:2023") {
  const response = await apiRequest("GET", `/api/worldbank/${indicator}?countries=${countries}&years=${years}`);
  return response.json();
}

export async function fetchWHOData(indicator: string) {
  const response = await apiRequest("GET", `/api/who/${indicator}`);
  return response.json();
}

export async function fetchSectorCharts(sector: string) {
  const response = await apiRequest("GET", `/api/charts/${sector}`);
  return response.json();
}

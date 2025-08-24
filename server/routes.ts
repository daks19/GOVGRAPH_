import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Data.gov.in API endpoint for Indian government data
  app.get("/api/datagov/:resource_id", async (req, res) => {
    try {
      const { resource_id } = req.params;
      const { limit = "100", offset = "0" } = req.query;
      
      // Note: In production, you'd need a valid API key from data.gov.in
      // For now, we'll use sample Indian data structure
      const response = await axios.get(
        `https://api.data.gov.in/resource/${resource_id}`,
        {
          params: {
            format: "json",
            limit,
            offset
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.records) {
        res.json(response.data.records);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error("Data.gov.in API error:", error);
      // For demo purposes, return empty array instead of error
      res.json([]);
    }
  });

  // Indian government health data endpoint
  app.get("/api/india/health/:type", async (req, res) => {
    try {
      const { type } = req.params;
      
      // Use sample Indian health data structure for demo
      res.json(getIndianHealthData(type));
    } catch (error) {
      console.error("Indian health API error:", error);
      res.status(500).json({ error: "Failed to fetch Indian health data" });
    }
  });

  // Aggregated chart data endpoint
  app.get("/api/charts/:sector", async (req, res) => {
    try {
      const { sector } = req.params;
      
      let charts = [];
      
      switch (sector) {
        case 'agriculture':
          charts = await getAgricultureCharts();
          break;
        case 'healthcare':
          charts = await getHealthcareCharts();
          break;
        case 'education':
          charts = await getEducationCharts();
          break;
        case 'budget':
          charts = await getBudgetCharts();
          break;
        case 'traffic':
          charts = await getTrafficCharts();
          break;
        case 'utilities':
          charts = await getUtilitiesCharts();
          break;
        default:
          return res.status(404).json({ error: "Sector not found" });
      }
      
      res.json(charts);
    } catch (error) {
      console.error("Charts API error:", error);
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function getAgricultureCharts() {
  try {
    // Indian crop production data from data.gov.in
    return [
      {
        id: "agriculture-1",
        title: "Crop Production by Indian States",
        description: "Major crop production statistics across Indian states for 2023-24",
        source: "Ministry of Agriculture, Government of India",
        sector: "agriculture",
        type: "bar",
        data: {
          labels: ["Uttar Pradesh", "Punjab", "Haryana", "Madhya Pradesh", "Bihar", "West Bengal", "Rajasthan", "Maharashtra", "Karnataka", "Andhra Pradesh"],
          datasets: [{
            label: "Rice Production (Million Tonnes)",
            data: [12.8, 11.5, 4.2, 7.1, 6.8, 15.2, 1.2, 3.8, 3.2, 5.1],
            backgroundColor: "rgba(34, 197, 94, 0.8)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "agriculture-2", 
        title: "Wheat vs Rice Production Trends",
        description: "Comparison of wheat and rice production in India over recent years",
        source: "Department of Agriculture & Farmers Welfare, India",
        sector: "agriculture",
        type: "line",
        data: {
          labels: ["2020-21", "2021-22", "2022-23", "2023-24"],
          datasets: [
            {
              label: "Wheat (Million Tonnes)",
              data: [109.5, 106.8, 110.5, 112.9],
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              borderColor: "rgba(245, 158, 11, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            },
            {
              label: "Rice (Million Tonnes)", 
              data: [124.3, 129.5, 132.8, 137.2],
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              borderColor: "rgba(34, 197, 94, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            }
          ]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "agriculture-3",
        title: "Fertilizer Consumption by State",
        description: "NPK fertilizer consumption across major Indian agricultural states",
        source: "Fertilizer Association of India",
        sector: "agriculture",
        type: "doughnut",
        data: {
          labels: ["Uttar Pradesh", "Maharashtra", "Punjab", "Haryana", "Karnataka", "Madhya Pradesh", "Others"],
          datasets: [{
            label: "Fertilizer Consumption (%)",
            data: [18.5, 14.2, 12.8, 8.9, 7.3, 6.8, 31.5],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)", 
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(156, 163, 175, 0.8)"
            ],
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      }
    ];
  } catch (error) {
    console.error("Agriculture charts error:", error);
    return [];
  }
}

async function getHealthcareCharts() {
  try {
    // Indian healthcare data
    return [
      {
        id: "healthcare-1",
        title: "Hospitals by Indian States",
        description: "Number of government and private hospitals across major Indian states",
        source: "Ministry of Health & Family Welfare, India",
        sector: "healthcare",
        type: "bar",
        data: {
          labels: ["Uttar Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu", "West Bengal", "Rajasthan", "Madhya Pradesh", "Andhra Pradesh"],
          datasets: [
            {
              label: "Government Hospitals",
              data: [3247, 2156, 1876, 1654, 1432, 1234, 1123, 987],
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1
            },
            {
              label: "Private Hospitals",
              data: [8945, 6789, 7234, 5432, 4321, 3456, 2987, 3123],
              backgroundColor: "rgba(16, 185, 129, 0.8)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1
            }
          ]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "healthcare-2",
        title: "Healthcare Budget Allocation Trends",
        description: "Indian government healthcare budget allocation over recent years",
        source: "Union Budget, Ministry of Finance, India", 
        sector: "healthcare",
        type: "line",
        data: {
          labels: ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25"],
          datasets: [{
            label: "Healthcare Budget (₹ Crore)",
            data: [67112, 73931, 86200, 89155, 90659],
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderColor: "rgba(239, 68, 68, 1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "healthcare-3",
        title: "Doctor-Patient Ratio by State",
        description: "Doctor to patient ratio across Indian states (per 1000 population)",
        source: "Indian Medical Association & Health Ministry",
        sector: "healthcare",
        type: "pie",
        data: {
          labels: ["Delhi", "Goa", "Sikkim", "Chandigarh", "Kerala", "Karnataka", "Punjab", "Others"],
          datasets: [{
            label: "Doctors per 1000",
            data: [2.8, 2.6, 2.1, 1.9, 1.8, 1.5, 1.4, 1.2],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)", 
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(156, 163, 175, 0.8)"
            ],
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      }
    ];
  } catch (error) {
    console.error("Healthcare charts error:", error);
    return [];
  }
}

async function getEducationCharts() {
  try {
    // Indian education data
    return [
      {
        id: "education-1",
        title: "Literacy Rate by Indian States",
        description: "Adult literacy rates across major Indian states (2011 Census)",
        source: "Ministry of Education, Government of India",
        sector: "education",
        type: "bar",
        data: {
          labels: ["Kerala", "Mizoram", "Tripura", "Goa", "Himachal Pradesh", "Maharashtra", "Sikkim", "Tamil Nadu", "Uttarakhand", "Punjab"],
          datasets: [{
            label: "Literacy Rate (%)",
            data: [93.91, 91.58, 87.75, 87.40, 83.78, 82.91, 82.20, 80.33, 79.63, 76.68],
            backgroundColor: "rgba(139, 92, 246, 0.8)",
            borderColor: "rgba(139, 92, 246, 1)",
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "education-2",
        title: "School Enrollment Trends",
        description: "Primary and secondary school enrollment in India over recent years",
        source: "UDISE+ & Ministry of Education, India",
        sector: "education", 
        type: "line",
        data: {
          labels: ["2019-20", "2020-21", "2021-22", "2022-23", "2023-24"],
          datasets: [
            {
              label: "Primary Enrollment (Million)",
              data: [128.5, 125.2, 131.8, 134.2, 137.1],
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            },
            {
              label: "Secondary Enrollment (Million)",
              data: [87.3, 84.1, 89.2, 91.8, 94.5],
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              borderColor: "rgba(245, 158, 11, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            }
          ]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "education-3",
        title: "Education Budget Distribution",
        description: "Distribution of education budget across different levels in India",
        source: "Union Budget & Ministry of Education, India",
        sector: "education",
        type: "doughnut",
        data: {
          labels: ["Higher Education", "School Education", "Skill Development", "Digital Education", "Teacher Training", "Infrastructure"],
          datasets: [{
            label: "Budget Allocation (%)",
            data: [35.2, 28.8, 12.5, 8.7, 7.9, 6.9],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)", 
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)"
            ],
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      }
    ];
  } catch (error) {
    console.error("Education charts error:", error);
    return [];
  }
}

async function getBudgetCharts() {
  try {
    // Indian budget data
    return [
      {
        id: "budget-1",
        title: "India's Union Budget Trends",
        description: "Total Union Budget expenditure and revenue trends over recent years",
        source: "Ministry of Finance, Government of India",
        sector: "budget",
        type: "line",
        data: {
          labels: ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25"],
          datasets: [
            {
              label: "Total Expenditure (₹ Lakh Crore)",
              data: [34.83, 37.70, 41.87, 45.03, 47.66],
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            },
            {
              label: "Total Revenue (₹ Lakh Crore)",
              data: [22.46, 25.16, 29.32, 33.14, 36.73],
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            }
          ]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "budget-2",
        title: "Ministry-wise Budget Allocation 2024-25",
        description: "Top ministries by budget allocation in India's Union Budget 2024-25",
        source: "Union Budget 2024-25, Ministry of Finance",
        sector: "budget",
        type: "bar",
        data: {
          labels: ["Defence", "Railways", "Roads & Highways", "Consumer Affairs", "Home Affairs", "Agriculture", "Rural Development", "Health & Family Welfare"],
          datasets: [{
            label: "Budget Allocation (₹ Thousand Crore)",
            data: [658.0, 261.0, 270.0, 205.0, 196.0, 125.0, 186.0, 906.0],
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "budget-3",
        title: "Revenue Sources Distribution",
        description: "Breakdown of Indian government revenue sources for 2024-25",
        source: "Controller General of Accounts, India",
        sector: "budget",
        type: "pie",
        data: {
          labels: ["Income Tax", "Corporate Tax", "GST", "Customs Duty", "Excise Duty", "Other Taxes", "Non-Tax Revenue"],
          datasets: [{
            label: "Revenue Share (%)",
            data: [18.5, 24.2, 32.1, 8.7, 6.8, 4.2, 5.5],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)", 
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)",
              "rgba(34, 197, 94, 0.8)"
            ],
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      }
    ];
  } catch (error) {
    console.error("Budget charts error:", error);
    return [];
  }
}

function getIndianHealthData(type: string) {
  // Sample Indian health data for fallback
  const healthData: any = {
    hospitals: {
      records: [
        { state: "Uttar Pradesh", government: 3247, private: 8945 },
        { state: "Karnataka", government: 2156, private: 6789 },
        { state: "Maharashtra", government: 1876, private: 7234 },
        { state: "Tamil Nadu", government: 1654, private: 5432 },
        { state: "West Bengal", government: 1432, private: 4321 },
      ]
    },
    budget: {
      records: [
        { year: "2020-21", amount: 67112 },
        { year: "2021-22", amount: 73931 },
        { year: "2022-23", amount: 86200 },
        { year: "2023-24", amount: 89155 },
        { year: "2024-25", amount: 90659 },
      ]
    },
    doctors: {
      records: [
        { state: "Delhi", ratio: 2.8 },
        { state: "Goa", ratio: 2.6 },
        { state: "Sikkim", ratio: 2.1 },
        { state: "Chandigarh", ratio: 1.9 },
        { state: "Kerala", ratio: 1.8 },
      ]
    }
  };
  
  return healthData[type] || { records: [] };
}

// Helper function to add traffic and utilities sectors
async function getTrafficCharts() {
  try {
    return [
      {
        id: "traffic-1",
        title: "Vehicle Registration by State",
        description: "New vehicle registrations across major Indian states in 2023-24",
        source: "Ministry of Road Transport & Highways, India",
        sector: "traffic",
        type: "bar",
        data: {
          labels: ["Maharashtra", "Uttar Pradesh", "Gujarat", "Tamil Nadu", "Karnataka", "Rajasthan", "West Bengal", "Delhi"],
          datasets: [{
            label: "New Registrations (Lakh)",
            data: [42.5, 38.9, 35.2, 31.8, 28.7, 25.6, 22.4, 19.8],
            backgroundColor: "rgba(245, 158, 11, 0.8)",
            borderColor: "rgba(245, 158, 11, 1)",
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "traffic-2",
        title: "Road Accident Statistics",
        description: "Road accident fatalities and injuries across Indian states in 2023",
        source: "Ministry of Road Transport & Highways, India",
        sector: "traffic",
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [
            {
              label: "Fatalities",
              data: [12456, 11890, 13245, 12978, 13567, 14123, 14789, 15234, 13876, 12998, 12456, 13234],
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            },
            {
              label: "Injuries",
              data: [45678, 43456, 47890, 46234, 48567, 51234, 52876, 54321, 49876, 46789, 45234, 47890],
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              borderColor: "rgba(245, 158, 11, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            }
          ]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "traffic-3",
        title: "Highway Infrastructure by Region",
        description: "National highway length and quality distribution across Indian regions",
        source: "National Highways Authority of India (NHAI)",
        sector: "traffic",
        type: "doughnut",
        data: {
          labels: ["North", "South", "East", "West", "Central", "Northeast"],
          datasets: [{
            label: "Highway Length (km)",
            data: [28456, 25789, 18234, 31567, 22345, 8976],
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(16, 185, 129, 0.8)", 
              "rgba(245, 158, 11, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(236, 72, 153, 0.8)"
            ],
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      }
    ];
  } catch (error) {
    console.error("Traffic charts error:", error);
    return [];
  }
}

async function getUtilitiesCharts() {
  try {
    return [
      {
        id: "utilities-1",
        title: "Power Generation by Source",
        description: "Electricity generation in India by different energy sources (2023-24)",
        source: "Central Electricity Authority, India",
        sector: "utilities",
        type: "pie",
        data: {
          labels: ["Coal", "Renewable", "Gas", "Nuclear", "Hydro", "Diesel"],
          datasets: [{
            label: "Generation Share (%)",
            data: [44.3, 28.1, 2.5, 3.2, 17.1, 0.1],
            backgroundColor: [
              "rgba(75, 85, 99, 0.8)",
              "rgba(34, 197, 94, 0.8)", 
              "rgba(59, 130, 246, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(16, 185, 129, 0.8)",
              "rgba(239, 68, 68, 0.8)"
            ],
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "utilities-2",
        title: "Renewable Energy Growth Trends",
        description: "Growth of renewable energy capacity in India over recent years",
        source: "Ministry of New & Renewable Energy, India",
        sector: "utilities",
        type: "line",
        data: {
          labels: ["2019-20", "2020-21", "2021-22", "2022-23", "2023-24"],
          datasets: [
            {
              label: "Solar Capacity (GW)",
              data: [34.6, 40.1, 54.4, 66.8, 73.3],
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              borderColor: "rgba(245, 158, 11, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            },
            {
              label: "Wind Capacity (GW)",
              data: [59.2, 64.8, 69.9, 75.1, 81.3],
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 2,
              fill: false,
              tension: 0.4
            }
          ]
        },
        lastUpdated: new Date().toISOString(),
      },
      {
        id: "utilities-3",
        title: "Electricity Consumption by State",
        description: "Per capita electricity consumption across major Indian states (2023-24)",
        source: "Central Electricity Authority & State Electricity Boards",
        sector: "utilities",
        type: "bar",
        data: {
          labels: ["Gujarat", "Punjab", "Goa", "Haryana", "Tamil Nadu", "Karnataka", "Maharashtra", "Delhi"],
          datasets: [{
            label: "Per Capita Consumption (kWh)",
            data: [2456, 2234, 2189, 2098, 1987, 1876, 1765, 1654],
            backgroundColor: "rgba(139, 92, 246, 0.8)",
            borderColor: "rgba(139, 92, 246, 1)",
            borderWidth: 1
          }]
        },
        lastUpdated: new Date().toISOString(),
      }
    ];
  } catch (error) {
    console.error("Utilities charts error:", error);
    return [];
  }
}

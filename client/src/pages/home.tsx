import { useState } from "react";
import Header from "@/components/header";
import SectorRow from "@/components/sector-row";
import FullscreenModal from "@/components/fullscreen-modal";
import { ChartData } from "@shared/schema";

const sectors = [
  {
    id: "agriculture",
    name: "Agriculture & Food Security",
    description: "Explore interactive visualizations of agricultural production, food security, and farming trends across Indian states."
  },
  {
    id: "healthcare", 
    name: "Healthcare & Public Health",
    description: "Analyze hospital data, healthcare budget allocation, and medical infrastructure across India."
  },
  {
    id: "education",
    name: "Education & Learning", 
    description: "Discover literacy rates, school enrollment, and education spending statistics in India."
  },
  {
    id: "budget",
    name: "Government Budgets & Finance",
    description: "Examine Indian Union Budget trends, ministry allocations, and revenue sources."
  },
  {
    id: "traffic",
    name: "Transport & Traffic",
    description: "View vehicle registration data and transportation statistics across Indian states."
  },
  {
    id: "utilities",
    name: "Power & Utilities",
    description: "Analyze electricity generation, renewable energy, and power infrastructure in India."
  }
];

export default function Home() {
  const [selectedChart, setSelectedChart] = useState<ChartData | null>(null);
  const [allCharts, setAllCharts] = useState<ChartData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (chart: ChartData, charts: ChartData[]) => {
    setSelectedChart(chart);
    setAllCharts(charts);
    setCurrentIndex(charts.findIndex(c => c.id === chart.id));
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedChart(null);
    setAllCharts([]);
    setCurrentIndex(0);
    document.body.style.overflow = '';
  };

  const navigateChart = (direction: 'prev' | 'next') => {
    if (allCharts.length === 0) return;
    
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + allCharts.length) % allCharts.length
      : (currentIndex + 1) % allCharts.length;
    
    setCurrentIndex(newIndex);
    setSelectedChart(allCharts[newIndex]);
  };

  return (
    <div className="min-h-screen bg-netflix-black text-white" data-testid="home-page">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8 px-6" data-testid="hero-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 gradient-text" data-testid="hero-title">
            Indian Government Data
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl" data-testid="hero-description">
            Explore interactive visualizations of Indian public datasets across Agriculture, Healthcare, Education, Budget, Traffic, and Utilities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="px-6 pb-20" data-testid="main-content">
        <div className="max-w-7xl mx-auto space-y-12">
          {sectors.map((sector) => (
            <SectorRow
              key={sector.id}
              sector={sector}
              onChartClick={openModal}
              data-testid={`sector-row-${sector.id}`}
            />
          ))}
        </div>
      </main>

      {/* Fullscreen Modal */}
      {selectedChart && (
        <FullscreenModal
          chart={selectedChart}
          currentIndex={currentIndex}
          totalCharts={allCharts.length}
          onClose={closeModal}
          onNavigate={navigateChart}
          data-testid="fullscreen-modal"
        />
      )}
    </div>
  );
}

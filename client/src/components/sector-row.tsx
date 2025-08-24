import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import ChartCard from "@/components/chart-card";
import { ChartData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCustomChartsBySector } from "@/lib/custom-charts";

interface SectorRowProps {
  sector: {
    id: string;
    name: string;
    description: string;
  };
  onChartClick: (chart: ChartData, allCharts: ChartData[]) => void;
}

export default function SectorRow({ sector, onChartClick }: SectorRowProps) {
  const { data: apiCharts, isLoading, error } = useQuery<ChartData[]>({
    queryKey: ['/api/charts', sector.id],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const [customCharts, setCustomCharts] = useState<ChartData[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  // Load custom charts from localStorage
  useEffect(() => {
    const loadCustomCharts = () => {
      const custom = getCustomChartsBySector(sector.id);
      setCustomCharts(custom);
    };
    
    loadCustomCharts();
    
    // Listen for storage changes to update when new charts are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'govgraph-custom-charts') {
        loadCustomCharts();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events in case we're on the same tab
    const handleCustomUpdate = () => {
      loadCustomCharts();
    };
    
    window.addEventListener('customChartsUpdated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customChartsUpdated', handleCustomUpdate);
    };
  }, [sector.id]);
  
  // Combine API charts and custom charts
  const allCharts = [...(apiCharts || []), ...customCharts];

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Handle scroll navigation
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const chartWidth = 320 + 24; // Chart width + gap
    container.scrollBy({
      left: -chartWidth,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const chartWidth = 320 + 24; // Chart width + gap
    container.scrollBy({
      left: chartWidth,
      behavior: 'smooth'
    });
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScrollPosition();
    
    const handleScroll = () => {
      checkScrollPosition();
    };

    container.addEventListener('scroll', handleScroll);
    
    // Check on resize
    const handleResize = () => {
      checkScrollPosition();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [allCharts]);

  // Check scroll position when charts change
  useEffect(() => {
    checkScrollPosition();
  }, [allCharts, isLoading]);

  if (error) {
    return (
      <section data-testid={`sector-error-${sector.id}`}>
        <h3 className="text-2xl font-semibold mb-6 text-white">{sector.name}</h3>
        <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
          Failed to load {sector.name.toLowerCase()} data. Please try again later.
        </div>
      </section>
    );
  }

  return (
    <section data-testid={`sector-${sector.id}`} className="relative">
      <h3 className="text-2xl font-semibold mb-6 text-white" data-testid={`sector-title-${sector.id}`}>
        {sector.name}
      </h3>
      
      <div className="relative group">
        {/* Left Arrow */}
        {showLeftArrow && allCharts.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white border-none h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            data-testid={`scroll-left-${sector.id}`}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Right Arrow */}
        {showRightArrow && allCharts.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white border-none h-12 w-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            data-testid={`scroll-right-${sector.id}`}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
          data-testid={`sector-scroll-${sector.id}`}
        >
          <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0" 
                  style={{ width: '320px', height: '240px', scrollSnapAlign: 'start' }} 
                  data-testid={`loading-skeleton-${index}`}
                >
                  <Skeleton className="w-full h-full bg-netflix-dark rounded-lg" />
                </div>
              ))
            ) : allCharts && allCharts.length > 0 ? (
              allCharts.map((chart) => (
                <div
                  key={chart.id}
                  style={{ scrollSnapAlign: 'start' }}
                  className="flex-shrink-0"
                >
                  <ChartCard
                    chart={chart}
                    onClick={() => onChartClick(chart, allCharts)}
                    data-testid={`chart-card-${chart.id}`}
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-400 p-4" data-testid={`no-data-${sector.id}`}>
                No chart data available for {sector.name.toLowerCase()}.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

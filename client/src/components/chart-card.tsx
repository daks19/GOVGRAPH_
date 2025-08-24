import { useRef, useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { ChartData } from "@shared/schema";

ChartJS.register(...registerables);

interface ChartCardProps {
  chart: ChartData;
  onClick: () => void;
}

export default function ChartCard({ chart, onClick }: ChartCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: chart.type as any,
      data: chart.data,
      options: {
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
        scales: chart.type === 'pie' || chart.type === 'doughnut' ? {} : {
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
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chart]);

  return (
    <div 
      className="chart-card relative bg-netflix-dark rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group/card"
      style={{ width: '320px', height: '240px' }}
      onClick={onClick}
      data-testid={`chart-card-${chart.id}`}
    >
      {/* Chart Container - Full size, no overlays */}
      <div className="w-full h-full p-4" data-testid={`chart-container-${chart.id}`}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
      
      {/* Bookmark-style Slide-up Panel - Hidden by default */}
      <div 
        className="bookmark-panel absolute bottom-0 left-0 right-0 bg-gradient-to-t from-netflix-black via-netflix-black/95 to-netflix-black/80 p-4 transform translate-y-full transition-transform duration-300 ease-out group-hover/card:translate-y-0 rounded-b-lg border-t border-gov-blue/20"
        data-testid={`chart-panel-${chart.id}`}
      >
        {/* Bookmark tab indicator */}
        <div className="absolute -top-2 left-4 w-8 h-2 bg-gov-blue rounded-t-sm"></div>
        
        <h4 className="font-semibold text-white mb-2 text-base leading-tight" data-testid={`chart-title-${chart.id}`}>
          {chart.title}
        </h4>
        <p className="text-sm text-gray-300 mb-3 leading-relaxed line-clamp-2" data-testid={`chart-description-${chart.id}`}>
          {chart.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gov-light-blue font-medium" data-testid={`chart-source-${chart.id}`}>
            📊 {chart.source}
          </p>
          <div className="text-xs text-gray-400">
            Click to expand
          </div>
        </div>
      </div>
    </div>
  );
}

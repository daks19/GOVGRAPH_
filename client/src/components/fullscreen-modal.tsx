import { useRef, useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ChartData } from "@shared/schema";

ChartJS.register(...registerables);

interface FullscreenModalProps {
  chart: ChartData;
  currentIndex: number;
  totalCharts: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export default function FullscreenModal({ 
  chart, 
  currentIndex, 
  totalCharts, 
  onClose, 
  onNavigate 
}: FullscreenModalProps) {
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
        scales: chart.type === 'pie' || chart.type === 'doughnut' ? {} : {
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
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  return (
    <div className="modal-backdrop fixed inset-0 z-50 bg-black/80" data-testid="fullscreen-modal">
      <div className="relative w-full h-full flex flex-col">
        
        {/* Navigation Bar at Top */}
        <div className="absolute top-0 left-0 right-0 z-60 flex justify-between items-center p-6 bg-gradient-to-b from-black/70 to-transparent" data-testid="modal-header">
          <button 
            onClick={() => onNavigate('prev')}
            className="flex items-center space-x-2 text-white hover:text-gov-light-blue transition-colors"
            data-testid="prev-chart-button"
          >
            <ChevronLeft size={20} />
            <span className="hidden md:inline">Previous</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300" data-testid="chart-counter">
              {currentIndex + 1} of {totalCharts}
            </span>
            <button 
              onClick={onClose}
              className="text-white hover:text-red-400 transition-colors text-xl"
              data-testid="close-modal-button"
            >
              <X size={24} />
            </button>
          </div>
          
          <button 
            onClick={() => onNavigate('next')}
            className="flex items-center space-x-2 text-white hover:text-gov-light-blue transition-colors"
            data-testid="next-chart-button"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Chart Display Area */}
        <div className="flex-1 flex items-center justify-center p-6 pt-20" data-testid="modal-chart-area">
          <div className="w-full max-w-4xl h-96 bg-netflix-dark rounded-lg p-6">
            <canvas ref={canvasRef} className="w-full h-full" data-testid="modal-chart" />
          </div>
        </div>

        {/* Chart Information Caption */}
        <div className="bg-gradient-to-t from-black via-black/90 to-transparent p-6 space-y-3" data-testid="modal-caption">
          <h2 className="text-2xl font-bold text-white" data-testid="modal-chart-title">
            {chart.title}
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl" data-testid="modal-chart-description">
            {chart.description}
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gov-light-blue" data-testid="modal-chart-source">
              {chart.source}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400" data-testid="modal-chart-updated">
              Last updated: {new Date(chart.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: chart.type as any,
      data: chart.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(31, 31, 31, 0.9)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 1,
          },
        },
        scales:
          chart.type === "pie" || chart.type === "doughnut"
            ? {}
            : {
                x: { display: false },
                y: { display: false },
              },
        interaction: { intersect: false, mode: "index" },
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
      className="group chart-card relative flex-shrink-0 cursor-pointer border border-gov-blue/40 rounded-2xl bg-gov-dark shadow-md hover:shadow-lg overflow-hidden"
      style={{ width: "320px" }}
      onClick={onClick}
      data-testid={`chart-card-${chart.id}`}
    >
      {/* Chart area (only inner canvas scales, border stays fixed) */}
      <div className="w-full h-52 p-4 overflow-hidden relative z-0" data-testid={`chart-container-${chart.id}`}>
        <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform">
          <canvas ref={canvasRef} className="w-full h-full rounded-md" />
        </div>
      </div>

      <div className="border-t border-gov-blue/25 relative z-10">
        {/* Title + moving bookmark (normal flow) */}
        <div className="px-4 pt-3 pb-4" data-testid={`chart-title-wrapper-${chart.id}`}>
          <h4 className="font-semibold text-white text-base leading-tight" data-testid={`chart-title-${chart.id}`}>
            {chart.title}
          </h4>
        </div>

        {/* Sliding description + meta */}
        <div
          className="px-4 pb-0 -mt-2 overflow-hidden transition-[max-height,padding,opacity] duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-60 group-hover:pb-4 group-hover:pt-6 group-hover:opacity-100"
          data-testid={`chart-panel-${chart.id}`}
        >
          <p
            className="text-sm text-gray-300 mb-3 leading-relaxed"
            data-testid={`chart-description-${chart.id}`}
          >
            {chart.description}
          </p>
          <div className="flex items-center justify-between">
            <p
              className="text-xs text-gov-light-blue font-medium"
              data-testid={`chart-source-${chart.id}`}
            >
              📊 {chart.source}
            </p>
            <div className="text-xs text-gray-400">Hover for details</div>
          </div>
        </div>
      </div>
    </div>
  );
}
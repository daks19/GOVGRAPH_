import { useRef, useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

interface ChartPreviewProps {
  data: any;
  type: 'bar' | 'line' | 'pie';
  title?: string;
}

export default function ChartPreview({ data, type, title }: ChartPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new ChartJS(ctx, {
      type: type as any,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === 'pie',
            position: 'bottom',
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
        scales: type === 'pie' ? {} : {
          x: {
            display: true,
            ticks: {
              color: 'white',
              maxTicksLimit: 8,
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
  }, [data, type, title]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
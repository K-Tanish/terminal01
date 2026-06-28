import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export function StatusDonutChart({ data, total }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    if (!canvasRef.current || !data) return;
    
    const ctx = canvasRef.current.getContext('2d');
    
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels, // ['Active', 'Completed', 'Planned', 'Failed']
        datasets: [{
          data: data.counts,
          backgroundColor: ['#e3ff73', '#1e293b', '#cbd5e1', '#ef4444'],
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 16, font: { size: 12 } }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw;
                const pct = total ? ((value / total) * 100).toFixed(1) : 0;
                return `${context.label}: ${value.toLocaleString()} (${pct}%)`;
              }
            }
          }
        },
        animation: { duration: 600, easing: 'easeOutQuart' },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [data, total]);

  return (
    <>
      <canvas ref={canvasRef} />
      {/* Center of donut absolute positioning */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <div className="text-[24px] font-bold text-gray-900">{total?.toLocaleString() || 0}</div>
        <div className="text-[11px] font-medium text-gray-400">Total Projects</div>
      </div>
    </>
  );
}

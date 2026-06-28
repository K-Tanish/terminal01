import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export function IndustryBarChart({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    if (!canvasRef.current || !data) return;
    
    const ctx = canvasRef.current.getContext('2d');
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 0); // left to right
    gradient.addColorStop(0, '#1e293b'); // slate-800
    gradient.addColorStop(1, '#64748b'); // slate-500

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: gradient,
          borderRadius: 6,
          barThickness: 18
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            min: 0,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#64748b', font: { size: 11 } },
            title: { display: true, text: 'Average ROI %', color: '#64748b', font: { size: 11, weight: '500' } }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#1e293b', font: { size: 12, weight: '500' } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.raw.toFixed(2)}%`;
              }
            }
          }
        },
        animation: { duration: 800, easing: 'easeOutCubic' },
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
  }, [data]);

  return <canvas ref={canvasRef} />;
}

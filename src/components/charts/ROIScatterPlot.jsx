import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function formatShort(num) {
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(0)}K`;
  return `$${num}`;
}

export function ROIScatterPlot({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    if (!canvasRef.current || !data) return;
    
    const ctx = canvasRef.current.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Projects',
          data: data, // Array of {x, y}
          backgroundColor: '#e3ff73',
          borderColor: '#1e293b',
          pointRadius: 4,
          pointHoverRadius: 6,
          borderWidth: 1.5
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: function(value) {
                return formatShort(value);
              }
            },
            title: { display: true, text: 'Budget (USD)', color: '#64748b', font: { size: 11, weight: '500' } }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: function(value) {
                return value + '%';
              }
            },
            title: { display: true, text: 'ROI %', color: '#64748b', font: { size: 11, weight: '500' } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const x = formatShort(context.parsed.x);
                const y = context.parsed.y.toFixed(2) + '%';
                return `Budget: ${x} | ROI: ${y}`;
              }
            }
          }
        },
        animation: { duration: 500 },
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

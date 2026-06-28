import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function formatSavingsShort(num) {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toLocaleString()}`;
}

export function SavingsTrendLine({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    if (!canvasRef.current || !data) return;
    
    const ctx = canvasRef.current.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'Cumulative Savings (USD)',
          data: data.data,
          borderColor: '#1e293b',
          backgroundColor: 'rgba(30, 41, 59, 0.06)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#e3ff73',
          pointBorderColor: '#1e293b',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2.5
        }]
      },
      options: {
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            title: { display: true, text: 'Start Year', color: '#64748b', font: { size: 11, weight: '500' } }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: { 
              color: '#64748b', 
              font: { size: 11 },
              callback: function(value) {
                return formatSavingsShort(value);
              }
            },
            title: { display: true, text: 'Cumulative Savings', color: '#64748b', font: { size: 11, weight: '500' } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Savings: ${formatSavingsShort(context.raw)}`;
              }
            }
          }
        },
        animation: { duration: 900, easing: 'easeOutQuart' },
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

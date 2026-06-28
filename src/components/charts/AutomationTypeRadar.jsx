import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export function AutomationTypeRadar({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    
    if (!canvasRef.current || !data) return;
    
    const ctx = canvasRef.current.getContext('2d');

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Avg ROI (normalized)',
            data: data.roi,
            borderColor: '#1e293b',
            backgroundColor: 'rgba(30,41,59,0.1)',
            pointBackgroundColor: '#1e293b'
          },
          {
            label: 'Avg Savings (normalized)',
            data: data.savings,
            borderColor: '#b4d131', // darker neon green for border
            backgroundColor: 'rgba(227,255,115,0.25)',
            pointBackgroundColor: '#e3ff73',
            pointBorderColor: '#1e293b'
          },
          {
            label: 'Avg Hours Saved (normalized)',
            data: data.hours,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.12)',
            pointBackgroundColor: '#10b981'
          }
        ]
      },
      options: {
        scales: {
          r: {
            grid: { color: '#f1f5f9' },
            pointLabels: { color: '#1e293b', font: { size: 11, weight: '500' } },
            ticks: { display: false },
            angleLines: { color: '#f1f5f9' }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { padding: 12, font: { size: 11 } }
          }
        },
        animation: { duration: 700, easing: 'easeOutQuart' },
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

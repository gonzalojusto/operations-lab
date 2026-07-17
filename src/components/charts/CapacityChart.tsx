import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { WEEKDAY_LABELS } from '../../services/capacityPlanner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface CapacityChartProps {
  dailyRequiredHours: number[];
  dailyAvailableHours: number[];
}

export function CapacityChart({ dailyRequiredHours, dailyAvailableHours }: CapacityChartProps) {
  const data = {
    labels: WEEKDAY_LABELS.map((d) => d.slice(0, 3)),
    datasets: [
      {
        label: 'Horas requeridas',
        data: dailyRequiredHours,
        backgroundColor: 'rgba(242, 85, 90, 0.55)',
        borderRadius: 4,
      },
      {
        label: 'Horas disponibles',
        data: dailyAvailableHours,
        backgroundColor: 'rgba(79, 124, 255, 0.55)',
        borderRadius: 4,
      },
    ],
  };

  return (
    <div style={{ height: 220 }}>
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { color: '#a4a8b3', font: { size: 11 } }, grid: { display: false } },
            y: { ticks: { color: '#6b6f7a', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } },
          },
          plugins: {
            legend: { labels: { color: '#a4a8b3', font: { size: 11, family: 'Inter' } } },
            tooltip: {
              backgroundColor: '#16181d',
              borderColor: '#33363f',
              borderWidth: 1,
              titleColor: '#f4f5f7',
              bodyColor: '#a4a8b3',
            },
          },
        }}
      />
    </div>
  );
}

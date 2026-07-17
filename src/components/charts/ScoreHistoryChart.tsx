import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import type { ScoreHistoryEntry } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export function ScoreHistoryChart({ entries }: { entries: ScoreHistoryEntry[] }) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const data = {
    labels: sorted.map((e) => new Date(e.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })),
    datasets: [
      {
        label: 'Operations Score',
        data: sorted.map((e) => e.globalScore),
        borderColor: '#4f7cff',
        backgroundColor: 'rgba(79, 124, 255, 0.12)',
        pointBackgroundColor: '#4f7cff',
        pointRadius: 4,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#6b6f7a', font: { size: 10 } }, grid: { display: false } },
      y: {
        min: 0,
        max: 100,
        ticks: { color: '#6b6f7a', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.06)' },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#16181d',
        borderColor: '#33363f',
        borderWidth: 1,
        titleColor: '#f4f5f7',
        bodyColor: '#a4a8b3',
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Line data={data} options={options} />
    </div>
  );
}

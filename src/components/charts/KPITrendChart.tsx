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
import type { KPIEntry } from '../../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface KPITrendChartProps {
  entries: KPIEntry[];
  target: number;
  unit: string;
}

export function KPITrendChart({ entries, target, unit }: KPITrendChartProps) {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  const data = {
    labels: sorted.map((e) => e.date),
    datasets: [
      {
        label: `Valor (${unit})`,
        data: sorted.map((e) => e.value),
        borderColor: '#4f7cff',
        backgroundColor: 'rgba(79, 124, 255, 0.12)',
        pointBackgroundColor: '#4f7cff',
        pointRadius: 3,
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Target',
        data: sorted.map(() => target),
        borderColor: '#6b6f7a',
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#6b6f7a', font: { size: 10 } }, grid: { display: false } },
      y: { ticks: { color: '#6b6f7a', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.06)' } },
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
    <div style={{ height: 140 }}>
      <Line data={data} options={options} />
    </div>
  );
}

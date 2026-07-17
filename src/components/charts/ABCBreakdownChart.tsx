import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ABCBreakdownChartProps {
  a: number;
  b: number;
  c: number;
}

export function ABCBreakdownChart({ a, b, c }: ABCBreakdownChartProps) {
  const data = {
    labels: [`A (${a})`, `B (${b})`, `C (${c})`],
    datasets: [
      {
        data: [a, b, c],
        backgroundColor: ['#2fd47a', '#f5b83d', '#6b6f7a'],
        borderColor: '#16181d',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="max-w-[220px] mx-auto">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { color: '#a4a8b3', font: { size: 11, family: 'Inter' }, padding: 12, boxWidth: 10 },
            },
            tooltip: {
              backgroundColor: '#16181d',
              borderColor: '#33363f',
              borderWidth: 1,
              titleColor: '#f4f5f7',
              bodyColor: '#a4a8b3',
            },
          },
          cutout: '65%',
        }}
      />
    </div>
  );
}

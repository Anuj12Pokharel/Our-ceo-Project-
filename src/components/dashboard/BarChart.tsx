import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  data: any[];
  xKey: string;
  bars: {
    key: string;
    name: string;
    fill: string;
    axis?: 'left' | 'right'; // optional, for dual-axis
  }[];
  height?: number;
}

export const BarChart = ({ data, xKey, bars, height = 350 }: BarChartProps) => {
  const hasDualAxis = bars.length === 2;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        {hasDualAxis ? (
          <>
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
          </>
        ) : (
          <YAxis />
        )}
        <Tooltip />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            fill={bar.fill}
            yAxisId={hasDualAxis ? bar.axis || (bar.key === 'users' ? 'left' : 'right') : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

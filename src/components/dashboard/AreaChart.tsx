import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaConfig {
  key: string;
  name: string;
  stroke?: string;
  fill?: string;
  fillOpacity?: number;
  stackId?: string | number;
}

interface AreaChartProps {
  config: {
    data: any[];
    xKey: string;
    yAreas: AreaConfig[];
    height?: number;
  };
}

export const AreaChart = ({ config }: AreaChartProps) => {
  const { data, xKey, yAreas, height = 300 } = config;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        {yAreas.map((area) => (
          <Area
            key={area.key}
            type="monotone"
            dataKey={area.key}
            name={area.name}
            stroke={area.stroke || "#3b82f6"}
            fill={area.fill || "#3b82f6"}
            fillOpacity={area.fillOpacity ?? 0.6}
            stackId={area.stackId}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
};

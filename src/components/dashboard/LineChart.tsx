import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', clients: 180, revenue: 45000 },
  { month: 'Feb', clients: 195, revenue: 52000 },
  { month: 'Mar', clients: 210, revenue: 58000 },
  { month: 'Apr', clients: 225, revenue: 62000 },
  { month: 'May', clients: 235, revenue: 68000 },
  { month: 'Jun', clients: 247, revenue: 72000 },
];

export const LineChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="clients" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Total Clients"
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Revenue ($)"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}; 
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from "../supabaseClient";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC", "#FF6666", "#66CCFF", "#FFB347", "#B6D7A8"
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff",
        border: "1px solid #ccc",
        padding: "8px 16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        fontWeight: 500
      }}>
        <span style={{ color: payload[0].color, fontWeight: 700 }}>{payload[0].name}</span>: ${payload[0].value.toFixed(2)}
      </div>
    );
  }
  return null;
};

const ExpenseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data: expenses, error } = await supabase
        .from("expenses")
        .select("*");
      if (error) {
        console.error("Supabase error:", error);
        return;
      }
      if (!Array.isArray(expenses)) {
        console.error("Expenses is not an array:", expenses);
        return;
      }
      // Group by category
      const grouped = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
        return acc;
      }, {});
      const chartData = Object.entries(grouped).map(([category, amount]) => ({
        name: category,
        value: amount,
      }));
      setData(chartData);
    };
    fetchExpenses();
  }, []);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div style={{
      width: '100%',
      maxWidth: 500,
      margin: '2rem auto',
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      padding: 24
    }}>
      <h3 style={{ textAlign: "center", fontWeight: 700, fontSize: 24, marginBottom: 16 }}>
        Expense Breakdown by Category
      </h3>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label
              value={`Total\n$${total.toFixed(2)}`}
              position="center"
              style={{ fontSize: 18, fontWeight: "bold", fill: "#333", whiteSpace: "pre-line" }}
            />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;

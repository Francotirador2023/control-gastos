"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

type Expense = {
    date: string;
    category: string;
    amount: number;
    description: string;
};

type Props = {
    expenses: Expense[];
};

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c'];

export function DashboardCharts({ expenses }: Props) {
    // 1. Calculate totals by category
    const categoryTotals = expenses.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += curr.amount;
        } else {
            acc.push({ name: curr.category, value: curr.amount });
        }
        return acc;
    }, [] as { name: string; value: number }[]);

    // 2. Calculate daily spending (last 7 entries for simplicity or grouped by date)
    // Grouping by date
    const dailySpending = expenses.reduce((acc, curr) => {
        const date = curr.date; // Assuming DD/MM/YYYY from sheet
        if (!acc[date]) acc[date] = 0;
        acc[date] += curr.amount;
        return acc;
    }, {} as Record<string, number>);

    // Sort dates and take last 7
    const lastDays = Object.keys(dailySpending)
        .sort((a, b) => { // Simple sort assuming ISO or consistent format if not we'd need parsing
            // The date comes from sheets as formatted string. 
            // If valid spanish date DD/MM/YYYY, simple sort might fail. 
            // Let's rely on sheet order for now or just display raw.
            return 0;
        })
        .slice(-7)
        .map(date => ({
            name: date.split('/').slice(0, 2).join('/'), // DD/MM
            monto: dailySpending[date]
        }));


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Donut Chart - Categories */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-6 rounded-2xl border border-white/10"
            >
                <h3 className="text-xl font-semibold mb-4 text-center">Gastos por Categoría</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryTotals}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryTotals.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Bar Chart - Daily Trend */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-2xl border border-white/10"
            >
                <h3 className="text-xl font-semibold mb-4 text-center">Tendencia Diaria</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={lastDays}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                            />
                            <Bar dataKey="monto" fill="#8884d8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
}

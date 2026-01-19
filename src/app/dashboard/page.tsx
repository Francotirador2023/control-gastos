import { getExpenses } from "@/lib/sheets";
import { DashboardCharts } from "@/components/dashboard-charts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic'; // Ensure we always get fresh data

export default async function DashboardPage() {
    const expenses = await getExpenses();

    // Calculate Summary Stats
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const transactionCount = expenses.length;

    return (
        <div className="flex-1 p-4 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/20 via-background to-background min-h-screen">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Financiero</h1>
                        <p className="text-muted text-sm">Resumen de tus gastos e historial</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-medium text-muted hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al formulario
                    </Link>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="glass p-6 rounded-2xl border border-white/10">
                        <p className="text-sm font-medium text-muted mb-2">Gasto Total</p>
                        <p className="text-3xl font-bold text-white">
                            ${totalSpent.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/10">
                        <p className="text-sm font-medium text-muted mb-2">Transacciones</p>
                        <p className="text-3xl font-bold text-white">{transactionCount}</p>
                    </div>
                    <div className="glass p-6 rounded-2xl border border-white/10">
                        <p className="text-sm font-medium text-muted mb-2">Promedio por Gasto</p>
                        <p className="text-3xl font-bold text-white">
                            ${transactionCount > 0 ? (totalSpent / transactionCount).toLocaleString('es-PE', { minimumFractionDigits: 2 }) : '0.00'}
                        </p>
                    </div>
                </div>

                {/* Visualizations */}
                <DashboardCharts expenses={expenses} />

                {/* Recent Transactions List */}
                <div className="glass rounded-2xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-lg font-semibold text-white">Últimos Movimientos</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-muted font-medium">
                                <tr>
                                    <th className="px-6 py-4">Fecha</th>
                                    <th className="px-6 py-4">Categoría</th>
                                    <th className="px-6 py-4">Descripción</th>
                                    <th className="px-6 py-4 text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-gray-300">
                                {expenses.slice().reverse().slice(0, 5).map((expense, i) => (
                                    // Using index as key since we don't have unique IDs yet
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium">{expense.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{expense.description || '-'}</td>
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            ${expense.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {expenses.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-muted">
                                            No hay gastos registrados aún.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

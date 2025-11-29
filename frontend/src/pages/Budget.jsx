import { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, TrendingUp, Plus, Trash2 } from 'lucide-react';

const Budget = () => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    // Placeholder for fixed expenses until backend support is added
    const [fixedExpenses, setFixedExpenses] = useState([
        { id: 1, name: 'Rent', amount: 12000 },
        { id: 2, name: 'Netflix', amount: 499 },
    ]);

    const fetchSummary = async () => {
        try {
            const res = await api.get('/transactions');
            const data = res.data;
            const income = data
                .filter((t) => t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);
            const expense = data
                .filter((t) => t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);
            setSummary({ income, expense, balance: income - expense });
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    // 33-33-33 Rule Calculations
    const rule33 = {
        needs: Math.round(summary.income * 0.33),
        wants: Math.round(summary.income * 0.33),
        savings: Math.round(summary.income * 0.33),
    };

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-bold text-gray-900">Budget & Planning</h2>

            {/* Visual 33-33-33 Rule */}
            <div className="card">
                <div className="flex items-center space-x-2 mb-6">
                    <PieChart className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-bold text-gray-900">33-33-33 Rule Visualization</h3>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around space-y-6 md:space-y-0">
                    {/* CSS Pie Chart */}
                    <div className="relative w-48 h-48 rounded-full"
                        style={{
                            background: `conic-gradient(
                                #3B82F6 0% 33%, 
                                #A855F7 33% 66%, 
                                #22C55E 66% 100%
                            )`
                        }}
                    >
                        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-gray-500">Total Income</span>
                            <span className="font-bold text-gray-900">₹{summary.income.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Legend / Details */}
                    <div className="space-y-4 w-full md:w-1/2">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="font-medium text-gray-700">Needs (33%)</span>
                            </div>
                            <span className="font-bold text-blue-700">₹{rule33.needs.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                <span className="font-medium text-gray-700">Wants (33%)</span>
                            </div>
                            <span className="font-bold text-purple-700">₹{rule33.wants.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="font-medium text-gray-700">Savings (33%)</span>
                            </div>
                            <span className="font-bold text-green-700">₹{rule33.savings.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Expenses */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Fixed Expenses</h3>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </button>
                </div>
                <div className="space-y-3">
                    {fixedExpenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{expense.name}</span>
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-gray-900">₹{expense.amount.toLocaleString()}</span>
                                <button className="text-gray-400 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                        <span>Total Fixed</span>
                        <span>₹{fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="card bg-secondary-50 border border-secondary-100">
                <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-secondary-600 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-secondary-900 mb-2">Analysis</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Your fixed expenses are <strong>{Math.round((fixedExpenses.reduce((acc, curr) => acc + curr.amount, 0) / summary.income) * 100)}%</strong> of your income.
                            Ideally, keep "Needs" under 50% (or 33% if following the strict rule).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budget;

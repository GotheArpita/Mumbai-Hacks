import { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, TrendingUp, AlertCircle } from 'lucide-react';

const Budget = () => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch transactions to calculate budget
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
        needs: summary.income * 0.33,
        wants: summary.income * 0.33,
        savings: summary.income * 0.33,
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Budget & Planning</h2>

            {/* 33-33-33 Rule Widget */}
            <div className="card">
                <div className="flex items-center space-x-2 mb-4">
                    <PieChart className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-bold text-gray-900">33-33-33 Budget Rule</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 font-medium">Needs (Rent, Bills, Food)</span>
                            <span className="font-bold text-blue-600">Target: ₹{rule33.needs.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className="bg-blue-500 h-3 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Essentials that you cannot live without.</p>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 font-medium">Wants (Entertainment, Dining)</span>
                            <span className="font-bold text-purple-600">Target: ₹{rule33.wants.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className="bg-purple-500 h-3 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Things that make life enjoyable but aren't essential.</p>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-700 font-medium">Savings & Investments</span>
                            <span className="font-bold text-green-600">Target: ₹{rule33.savings.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: '33%' }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Future security and financial goals.</p>
                    </div>
                </div>
            </div>

            {/* Fixed Expenses Section (Placeholder for now) */}
            <div className="card border-l-4 border-primary-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Fixed Expenses</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Track your recurring monthly payments like Rent, Netflix, Gym, etc.
                </p>
                <button className="btn-secondary text-sm w-full sm:w-auto">
                    + Add Recurring Expense
                </button>
            </div>

            {/* Insights */}
            <div className="card bg-secondary-50 border border-secondary-100">
                <div className="flex items-start space-x-3">
                    <TrendingUp className="h-6 w-6 text-secondary-600 mt-1" />
                    <div>
                        <h3 className="text-lg font-bold text-secondary-900 mb-2">Sahayogi Financial Advice</h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Based on your income of <strong>₹{summary.income.toLocaleString()}</strong>, you should aim to save at least <strong>₹{(summary.income * 0.2).toLocaleString()}</strong> (20%) per month.
                            The 33-33-33 rule is a great starting point, but feel free to adjust it to 50-30-20 (Needs-Wants-Savings) if that fits your lifestyle better!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Budget;

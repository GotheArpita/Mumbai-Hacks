import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { LogOut, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const CashFlow = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await api.get('/transactions');
            const data = res.data;

            // Calculate Summary
            const income = data
                .filter((t) => t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);
            const expense = data
                .filter((t) => t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);

            setSummary({
                income,
                expense,
                balance: income - expense,
            });

            // Get recent 3 transactions
            setRecentTransactions(data.slice(0, 3));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white border-none shadow-lg transform transition-all hover:scale-105">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-primary-100 font-medium">Net Balance</h3>
                    </div>
                    <p className="text-4xl font-bold">₹ {summary.balance.toLocaleString()}</p>
                    <p className="text-sm text-primary-200 mt-2">Available to spend</p>
                </div>

                <div className="card border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium">Total Income</h3>
                        <div className="p-1.5 bg-green-100 rounded-full">
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">+ ₹ {summary.income.toLocaleString()}</p>
                </div>

                <div className="card border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-500 font-medium">Total Expenses</h3>
                        <div className="p-1.5 bg-red-100 rounded-full">
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">- ₹ {summary.expense.toLocaleString()}</p>
                </div>
            </div>

            {/* Alerts */}
            {summary.expense > summary.income && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <LogOut className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-red-800">Spending Alert</h4>
                        <p className="text-sm text-red-700 mt-1">
                            Your expenses have exceeded your income. Review your transactions to get back on track.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashFlow;

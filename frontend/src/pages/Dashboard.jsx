import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

import ChatAssistant from '../components/ChatAssistant';
import { RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
            calculateSummary(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            // Fallback for demo if backend fails
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateSummary = (data) => {
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
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleTransactionAdded = (newTransaction) => {
        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);
        calculateSummary(updatedTransactions);
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            const updatedTransactions = transactions.filter((t) => t._id !== id);
            setTransactions(updatedTransactions);
            calculateSummary(updatedTransactions);
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleSimulate = async () => {
        try {
            setLoading(true);
            const res = await api.post('/transactions/simulate');
            const newTransactions = res.data;
            const updatedTransactions = [...newTransactions, ...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
            setTransactions(updatedTransactions);
            calculateSummary(updatedTransactions);
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    // 33-33-33 Rule Calculations
    const rule33 = {
        needs: summary.income * 0.33,
        wants: summary.income * 0.33,
        savings: summary.income * 0.33,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">Sahayogi</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-700 hidden sm:block">Hello, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-red-600 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none">
                        <h3 className="text-primary-100 font-medium">Net Balance</h3>
                        <p className="text-3xl font-bold mt-2">₹ {summary.balance.toLocaleString()}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-500 font-medium">Total Income</h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">+ ₹ {summary.income.toLocaleString()}</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-500 font-medium">Total Expenses</h3>
                        <p className="text-2xl font-bold text-red-600 mt-2">- ₹ {summary.expense.toLocaleString()}</p>
                    </div>
                </div>

                {/* Alerts */}
                {summary.expense > summary.income && (
                    <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <LogOut className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    <span className="font-bold">Warning:</span> Your expenses have exceeded your income. Consider reviewing your recent transactions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {summary.expense > 0 && summary.expense < summary.income && summary.expense > summary.income * 0.8 && (
                    <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <LogOut className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <span className="font-bold">Caution:</span> You have spent over 80% of your income. Keep an eye on your budget!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Add Transaction & List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Transactions</h2>
                            <button
                                onClick={handleSimulate}
                                disabled={loading}
                                className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Simulate Bank Sync</span>
                            </button>
                        </div>
                        <TransactionForm onTransactionAdded={handleTransactionAdded} />
                        <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                    </div>

                    {/* Right Column: Insights */}
                    <div className="space-y-8">
                        {/* 33-33-33 Rule Widget */}
                        <div className="card">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">33-33-33 Budget Rule</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Needs (Home, Taxes)</span>
                                        <span className="font-medium">Target: ₹{rule33.needs.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Wants (Fun)</span>
                                        <span className="font-medium">Target: ₹{rule33.wants.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Savings & Investments</span>
                                        <span className="font-medium">Target: ₹{rule33.savings.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    *Based on your total income. Try to allocate your spending to match these targets.
                                </p>
                            </div>
                        </div>

                        <div className="card bg-secondary-50 border-secondary-100">
                            <h3 className="text-lg font-bold text-secondary-900 mb-4">Sahayogi Insights</h3>
                            <div className="p-4 bg-white rounded-lg border border-secondary-100 shadow-sm">
                                <p className="text-gray-700">
                                    👋 Welcome to Sahayogi! Start adding your transactions to get personalized financial advice.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ChatAssistant />
        </div>
    );
};

export default Dashboard;

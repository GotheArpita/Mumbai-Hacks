import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Add Transaction & List */}
                    <div className="lg:col-span-2 space-y-8">
                        <TransactionForm onTransactionAdded={handleTransactionAdded} />
                        <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                    </div>

                    {/* Right Column: Insights (Placeholder for now) */}
                    <div className="space-y-8">
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
        </div>
    );
};

export default Dashboard;

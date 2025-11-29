import { useState, useEffect } from 'react';
import api from '../services/api';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { RefreshCw } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleTransactionAdded = (newTransaction) => {
        setTransactions([newTransaction, ...transactions]);
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            setTransactions(transactions.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const handleSimulate = async () => {
        try {
            setLoading(true);
            const res = await api.post('/transactions/simulate');
            const newTransactions = res.data;
            setTransactions([...newTransactions, ...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error('Simulation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                <button
                    onClick={handleSimulate}
                    disabled={loading}
                    className="flex items-center space-x-2 text-xs text-primary-600 hover:text-primary-700 font-medium bg-primary-50 px-3 py-1 rounded-full"
                    title="Populate with demo data"
                >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    <span>Simulate</span>
                </button>
            </div>

            <TransactionForm onTransactionAdded={handleTransactionAdded} />
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
        </div>
    );
};

export default Transactions;

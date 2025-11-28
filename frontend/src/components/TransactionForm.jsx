import { useState } from 'react';
import api from '../services/api';
import { PlusCircle, Loader } from 'lucide-react';

const TransactionForm = ({ onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const categories = {
        income: ['Salary', 'Freelance', 'Gig Payout', 'Gift', 'Other'],
        expense: ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'],
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/transactions', formData);
            onTransactionAdded(res.data);
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Transaction</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <button
                                type="button"
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md border ${formData.type === 'income'
                                        ? 'bg-green-50 text-green-700 border-green-500 z-10'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                            >
                                Income
                            </button>
                            <button
                                type="button"
                                className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md border -ml-px ${formData.type === 'expense'
                                        ? 'bg-red-50 text-red-700 border-red-500 z-10'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                            >
                                Expense
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">₹</span>
                            </div>
                            <input
                                type="number"
                                name="amount"
                                id="amount"
                                required
                                className="input-field pl-7"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            name="category"
                            required
                            className="input-field mt-1"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select...</option>
                            {categories[formData.type].map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required
                            className="input-field mt-1"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                    <input
                        type="text"
                        name="description"
                        id="description"
                        className="input-field mt-1"
                        placeholder="e.g. Uber to work"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex justify-center items-center"
                >
                    {loading ? <Loader className="animate-spin h-5 w-5" /> : <><PlusCircle className="mr-2 h-5 w-5" /> Add Transaction</>}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;

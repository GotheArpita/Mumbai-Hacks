import { Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const TransactionList = ({ transactions, onDelete }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="card text-center py-8">
                <p className="text-gray-500 italic">No transactions yet. Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
            <div className="space-y-4">
                {transactions.map((transaction) => (
                    <div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            {transaction.type === 'income' ? (
                                <ArrowUpCircle className="h-8 w-8 text-green-500" />
                            ) : (
                                <ArrowDownCircle className="h-8 w-8 text-red-500" />
                            )}
                            <div>
                                <p className="font-medium text-gray-900">{transaction.category}</p>
                                <p className="text-xs text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                    {transaction.description && ` • ${transaction.description}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span
                                className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount}
                            </span>
                            <button
                                onClick={() => onDelete(transaction._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;

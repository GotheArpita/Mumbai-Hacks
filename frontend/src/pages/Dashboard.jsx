import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">Sahayogi</h1>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 text-gray-700">Hello, {user?.name}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Summary Cards */}
                    <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none">
                        <h3 className="text-primary-100 font-medium">Net Balance</h3>
                        <p className="text-3xl font-bold mt-2">₹ 12,450</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-500 font-medium">Total Income</h3>
                        <p className="text-2xl font-bold text-green-600 mt-2">+ ₹ 25,000</p>
                    </div>
                    <div className="card">
                        <h3 className="text-gray-500 font-medium">Total Expenses</h3>
                        <p className="text-2xl font-bold text-red-600 mt-2">- ₹ 12,550</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Transactions Placeholder */}
                    <div className="card">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                        <div className="space-y-4">
                            <p className="text-gray-500 text-sm italic">No transactions yet.</p>
                        </div>
                    </div>

                    {/* AI Insights Placeholder */}
                    <div className="card bg-secondary-50 border-secondary-100">
                        <h3 className="text-lg font-bold text-secondary-900 mb-4">Sahayogi Insights</h3>
                        <div className="p-4 bg-white rounded-lg border border-secondary-100 shadow-sm">
                            <p className="text-gray-700">
                                👋 Welcome to Sahayogi! Start adding your transactions to get personalized financial advice.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

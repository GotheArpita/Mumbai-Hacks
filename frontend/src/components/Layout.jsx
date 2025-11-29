import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, DollarSign, PieChart, Target, LogOut } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ChatAssistant from './ChatAssistant';

const Layout = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', icon: Home, label: 'Overview' },
        { path: '/transactions', icon: DollarSign, label: 'Transactions' },
        { path: '/budget', icon: PieChart, label: 'Budget' },
        { path: '/goals', icon: Target, label: 'Goals' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Bar */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-primary-600">Sahayogi</h1>
                        </div>
                        <div className="flex items-center">
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

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-around items-center h-16">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(item.path)
                                            ? 'text-primary-600'
                                            : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <ChatAssistant />
        </div>
    );
};

export default Layout;

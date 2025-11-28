import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="text-2xl font-bold text-primary-600">Sahayogi</div>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
                    <Link to="/signup" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-8">
                        Your Friendly AI Financial Coach for <span className="text-primary-600">Irregular Incomes</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10">
                        Sahayogi helps gig workers, freelancers, and students manage unpredictable income streams with proactive nudges and personalized advice.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/signup" className="btn-primary flex items-center text-lg px-8 py-3">
                            Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>

                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">📊</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Tracking</h3>
                        <p className="text-gray-600">Easily track income and expenses with flexible categories designed for gig work.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🤖</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">AI Coach</h3>
                        <p className="text-gray-600">Get daily financial health checks and actionable nudges to stay on track.</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Goal Setting</h3>
                        <p className="text-gray-600">Set and achieve financial goals with visual progress tracking.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;

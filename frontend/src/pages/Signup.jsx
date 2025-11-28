import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, ArrowRight, CheckCircle } from 'lucide-react';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        occupation: '',
        incomeRhythm: 'Irregular',
        financialGoals: [],
    });
    const [error, setError] = useState('');
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGoalChange = (goal) => {
        const currentGoals = [...formData.financialGoals];
        if (currentGoals.includes(goal)) {
            setFormData({
                ...formData,
                financialGoals: currentGoals.filter((g) => g !== goal),
            });
        } else {
            setFormData({ ...formData, financialGoals: [...currentGoals, goal] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="max-w-md w-full space-y-8 card">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <UserPlus className="h-6 w-6 text-primary-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        {step === 1 ? 'Create Account' : 'Persona Intake'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 1 ? 'Start your journey to financial wellness' : 'Tell us a bit about yourself'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="input-field mt-1"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="input-field mt-1"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="input-field mt-1"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full btn-primary flex justify-center items-center"
                            >
                                Next <ArrowRight className="ml-2 h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                                <input
                                    id="occupation"
                                    name="occupation"
                                    type="text"
                                    placeholder="e.g. Freelance Designer, Student"
                                    className="input-field mt-1"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="incomeRhythm" className="block text-sm font-medium text-gray-700">Income Rhythm</label>
                                <select
                                    id="incomeRhythm"
                                    name="incomeRhythm"
                                    className="input-field mt-1"
                                    value={formData.incomeRhythm}
                                    onChange={handleChange}
                                >
                                    <option value="Weekly">Weekly</option>
                                    <option value="Bi-weekly">Bi-weekly</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Irregular">Irregular / Gig Work</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Financial Goals</label>
                                <div className="space-y-2">
                                    {['Emergency Fund', 'Pay off Debt', 'Save for Vacation', 'Invest'].map((goal) => (
                                        <div
                                            key={goal}
                                            onClick={() => handleGoalChange(goal)}
                                            className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition-colors ${formData.financialGoals.includes(goal)
                                                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>{goal}</span>
                                            {formData.financialGoals.includes(goal) && (
                                                <CheckCircle className="h-5 w-5 text-primary-600" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-1/3 btn-secondary"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="w-2/3 btn-primary"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Target, Plus, Trash2, Edit2, Save, X } from 'lucide-react';

const Goals = () => {
    const { user } = useContext(AuthContext);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        currentAmount: '0',
    });

    const fetchGoals = async () => {
        try {
            const res = await api.get('/auth/me');
            const userGoals = res.data.financialGoals || [];
            // Normalize
            const normalizedGoals = userGoals.map(g =>
                typeof g === 'string' ? { title: g, targetAmount: 0, currentAmount: 0 } : g
            );
            setGoals(normalizedGoals);
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleSaveGoals = async (updatedGoals) => {
        try {
            setLoading(true);
            await api.updateProfile({ ...user, financialGoals: updatedGoals });
            setGoals(updatedGoals);
            setShowForm(false);
            setIsEditing(false);
            setEditIndex(null);
            setFormData({ title: '', targetAmount: '', currentAmount: '0' });
        } catch (error) {
            console.error('Error saving goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        const newGoal = {
            title: formData.title,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount)
        };
        const updatedGoals = [...goals, newGoal];
        handleSaveGoals(updatedGoals);
    };

    const handleDeleteGoal = (index) => {
        const updatedGoals = goals.filter((_, i) => i !== index);
        handleSaveGoals(updatedGoals);
    };

    const startEdit = (index) => {
        const goal = goals[index];
        setFormData({
            title: goal.title,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount
        });
        setEditIndex(index);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleUpdateGoal = (e) => {
        e.preventDefault();
        const updatedGoals = [...goals];
        updatedGoals[editIndex] = {
            title: formData.title,
            targetAmount: Number(formData.targetAmount),
            currentAmount: Number(formData.currentAmount)
        };
        handleSaveGoals(updatedGoals);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Financial Goals</h2>
                {!showForm && (
                    <button
                        onClick={() => {
                            setFormData({ title: '', targetAmount: '', currentAmount: '0' });
                            setIsEditing(false);
                            setShowForm(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <Plus className="h-4 w-4" />
                        <span>New Goal</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="card bg-gray-50 animate-fade-in border border-primary-100">
                    <h3 className="font-bold text-gray-800 mb-4">{isEditing ? 'Edit Goal' : 'Add New Goal'}</h3>
                    <form onSubmit={isEditing ? handleUpdateGoal : handleAddGoal} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Goal Title</label>
                            <input
                                type="text"
                                required
                                className="input-field mt-1"
                                placeholder="e.g. New Laptop"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target Amount (₹)</label>
                                <input
                                    type="number"
                                    required
                                    className="input-field mt-1"
                                    placeholder="50000"
                                    value={formData.targetAmount}
                                    onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Saved So Far (₹)</label>
                                <input
                                    type="number"
                                    className="input-field mt-1"
                                    placeholder="0"
                                    value={formData.currentAmount}
                                    onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary flex items-center">
                                <Save className="h-4 w-4 mr-2" />
                                {isEditing ? 'Update Goal' : 'Save Goal'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal, index) => (
                    <div key={index} className="card hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Target className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{goal.title}</h3>
                                    <p className="text-xs text-gray-500">Target: ₹{goal.targetAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => startEdit(index)}
                                    className="text-gray-400 hover:text-blue-500 p-1"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteGoal(index)}
                                    className="text-gray-400 hover:text-red-500 p-1"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium">
                                    {goal.targetAmount > 0
                                        ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
                                        : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>₹{goal.currentAmount?.toLocaleString()} saved</span>
                                <span>₹{Math.max(goal.targetAmount - goal.currentAmount, 0)?.toLocaleString()} to go</span>
                            </div>
                        </div>
                    </div>
                ))}

                {goals.length === 0 && !showForm && (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <Target className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No goals set yet. Start saving for your dreams!</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="mt-4 text-primary-600 font-medium hover:text-primary-700"
                        >
                            + Add your first goal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;

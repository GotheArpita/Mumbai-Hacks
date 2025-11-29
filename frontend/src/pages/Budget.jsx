import { useState, useEffect } from 'react';
import api from '../services/api';
import { PieChart, TrendingUp, Plus, Trash2 } from 'lucide-react';

const Budget = () => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    // Fixed expenses (shared via localStorage for now)
    const [fixedExpenses, setFixedExpenses] = useState([
        { id: 1, name: 'Rent', amount: 12000, debitDay: 5 },
        { id: 2, name: 'Netflix', amount: 499, debitDay: 15 },
    ]);
    const [rulePercents, setRulePercents] = useState({ needs: 33, wants: 33, savings: 34 });
    const totalFixed = fixedExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    const fetchSummary = async () => {
        try {
            const res = await api.get('/transactions');
            const data = res.data;
            const income = data
                .filter((t) => t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);
            const expense = data
                .filter((t) => t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);
            setSummary({ income, expense, balance: income - expense });
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();

        // Load fixed expenses & rule from localStorage if present
        const storedFixed = localStorage.getItem('fixedExpenses');
        if (storedFixed) {
            try {
                const parsed = JSON.parse(storedFixed);
                if (Array.isArray(parsed)) {
                    setFixedExpenses(parsed);
                }
            } catch {
                // ignore
            }
        }
        const storedRule = localStorage.getItem('budgetRulePercents');
        if (storedRule) {
            try {
                const parsed = JSON.parse(storedRule);
                if (parsed.needs && parsed.wants && parsed.savings) {
                    setRulePercents(parsed);
                }
            } catch {
                // ignore
            }
        }
    }, []);

    // Persist helpers
    useEffect(() => {
        localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));
    }, [fixedExpenses]);

    useEffect(() => {
        localStorage.setItem('budgetRulePercents', JSON.stringify(rulePercents));
    }, [rulePercents]);

    // Adaptive 33-33-33 Rule Calculations
    const adjustedPercents = (() => {
        if (summary.income <= 0) return rulePercents;

        const fixedRatio = totalFixed / summary.income;
        const isOverspending = summary.expense > summary.income;

        // If user is under stress, tilt more towards needs and less towards wants
        if (isOverspending || fixedRatio > 0.6) {
            return {
                needs: Math.max(rulePercents.needs, 50),
                wants: Math.min(rulePercents.wants, 10),
                savings: 100 - Math.max(rulePercents.needs, 50) - Math.min(rulePercents.wants, 10),
            };
        }

        return rulePercents;
    })();

    const rule33 = {
        needs: Math.round((summary.income * adjustedPercents.needs) / 100),
        wants: Math.round((summary.income * adjustedPercents.wants) / 100),
        savings: Math.round((summary.income * adjustedPercents.savings) / 100),
    };

    const handleRuleChange = (field, value) => {
        const num = Number(value) || 0;
        const next = { ...rulePercents, [field]: num };
        const total = next.needs + next.wants + next.savings;
        if (total === 0) {
            setRulePercents({ needs: 33, wants: 33, savings: 34 });
        } else {
            const factor = 100 / total;
            setRulePercents({
                needs: Math.round(next.needs * factor),
                wants: Math.round(next.wants * factor),
                savings: 100 - Math.round(next.needs * factor) - Math.round(next.wants * factor),
            });
        }
    };

    const handleFixedChange = (id, field, value) => {
        setFixedExpenses(prev =>
            prev.map(exp =>
                exp.id === id ? { ...exp, [field]: field === 'amount' || field === 'debitDay' ? Number(value) : value } : exp
            )
        );
    };

    const handleAddFixed = () => {
        const nextId = fixedExpenses.length ? Math.max(...fixedExpenses.map(e => e.id)) + 1 : 1;
        setFixedExpenses(prev => [
            ...prev,
            { id: nextId, name: 'New Bill', amount: 0, debitDay: 1 },
        ]);
    };

    const handleDeleteFixed = (id) => {
        setFixedExpenses(prev => prev.filter(exp => exp.id !== id));
    };

    return (
        <div className="space-y-8 pb-20">
            <h2 className="text-2xl font-bold text-gray-900">Budget & Planning</h2>

            {/* Visual 33-33-33 Rule */}
            <div className="card">
                <div className="flex items-center space-x-2 mb-6">
                    <PieChart className="h-6 w-6 text-primary-600" />
                    <h3 className="text-lg font-bold text-gray-900">Smart 33-33-33 Rule</h3>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-around space-y-6 md:space-y-0">
                    {/* CSS Pie Chart */}
                    <div className="relative w-48 h-48 rounded-full"
                        style={{
                            background: `conic-gradient(
                                #3B82F6 0% 33%, 
                                #A855F7 33% 66%, 
                                #22C55E 66% 100%
                            )`
                        }}
                    >
                        <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center text-center">
                            <span className="text-xs text-gray-500">Total Income</span>
                            <span className="font-bold text-gray-900">₹{summary.income.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Legend / Details + Controls */}
                    <div className="space-y-4 w-full md:w-1/2">
                        {/* Needs */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">
                                        Needs ({adjustedPercents.needs}%)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>Adjust:</span>
                                    <input
                                        type="number"
                                        className="w-16 border rounded px-1 py-0.5 text-xs"
                                        value={rulePercents.needs}
                                        onChange={e => handleRuleChange('needs', e.target.value)}
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                            <span className="font-bold text-blue-700">₹{rule33.needs.toLocaleString()}</span>
                        </div>

                        {/* Wants */}
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">
                                        Wants ({adjustedPercents.wants}%)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>Adjust:</span>
                                    <input
                                        type="number"
                                        className="w-16 border rounded px-1 py-0.5 text-xs"
                                        value={rulePercents.wants}
                                        onChange={e => handleRuleChange('wants', e.target.value)}
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                            <span className="font-bold text-purple-700">₹{rule33.wants.toLocaleString()}</span>
                        </div>

                        {/* Savings */}
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">
                                        Savings ({adjustedPercents.savings}%)
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <span>Adjust:</span>
                                    <input
                                        type="number"
                                        className="w-16 border rounded px-1 py-0.5 text-xs"
                                        value={rulePercents.savings}
                                        onChange={e => handleRuleChange('savings', e.target.value)}
                                    />
                                    <span>%</span>
                                </div>
                            </div>
                            <span className="font-bold text-green-700">₹{rule33.savings.toLocaleString()}</span>
                        </div>

                        <p className="text-xs text-gray-500">
                            We’ll nudge these numbers towards Needs when your fixed bills are high or expenses exceed income,
                            so you can focus on clearing overdues first.
                        </p>
                    </div>
                </div>
            </div>

            {/* Fixed Expenses */}
            <div className="card">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Fixed Expenses</h3>
                    <button
                        onClick={handleAddFixed}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                    >
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </button>
                </div>
                <div className="space-y-3">
                    {fixedExpenses.map((expense) => (
                        <div key={expense.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                            <div className="flex-1 mr-4 space-y-1">
                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1 text-sm font-medium text-gray-800"
                                    value={expense.name}
                                    onChange={e => handleFixedChange(expense.id, 'name', e.target.value)}
                                />
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <span>Debit on</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="31"
                                            className="w-14 border rounded px-1 py-0.5"
                                            value={expense.debitDay || 1}
                                            onChange={e => handleFixedChange(expense.id, 'debitDay', e.target.value)}
                                        />
                                        <span>of every month</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex flex-col items-end">
                                    <input
                                        type="number"
                                        className="w-28 border rounded px-2 py-1 text-sm font-bold text-right"
                                        value={expense.amount}
                                        onChange={e => handleFixedChange(expense.id, 'amount', e.target.value)}
                                    />
                                    <span className="text-[11px] text-gray-500 mt-1">
                                        Will be reserved from your balance
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteFixed(expense.id)}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                        <span>Total Fixed</span>
                        <span>₹{totalFixed.toLocaleString()}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Budget;

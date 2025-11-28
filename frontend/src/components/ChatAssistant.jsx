import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import api from '../services/api';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m Sahayogi. Ask me anything about your finances!' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Get user context (simplified for now, could be fetched from context/state)
            const userContext = JSON.parse(localStorage.getItem('user')) || {};

            const response = await api.post('/ai/advice', {
                message: userMessage.content,
                context: {
                    name: userContext.name,
                    occupation: userContext.occupation,
                    goals: userContext.financialGoals
                }
            });

            const aiMessage = { role: 'assistant', content: response.data.message };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105"
                >
                    <MessageCircle className="h-6 w-6" />
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col h-[500px] border border-gray-200 overflow-hidden transition-all">
                    {/* Header */}
                    <div className="bg-primary-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-5 w-5" />
                            <span className="font-semibold">Sahayogi Assistant</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-primary-700 p-1 rounded">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                            ? 'bg-primary-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about savings, tips..."
                                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                disabled={loading || !input.trim()}
                                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatAssistant;

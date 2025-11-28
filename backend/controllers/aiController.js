const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// @desc    Get AI Financial Advice
// @route   POST /api/ai/advice
// @access  Private
const getFinancialAdvice = async (req, res) => {
    const { message, context } = req.body;

    // Context usually includes user financial summary
    const prompt = `
    You are Sahayogi, a friendly and helpful financial assistant for gig workers and students.
    
    User Context:
    ${JSON.stringify(context || {})}
    
    User Question:
    ${message}
    
    Provide a concise, actionable, and empathetic response. Focus on the 33-33-33 rule if applicable.
    `;

    try {
        let responseText = "";

        if (process.env.GEMINI_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            responseText = response.text();
        } else if (process.env.OPENAI_API_KEY) {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const completion = await openai.chat.completions.create({
                messages: [{ role: "system", content: prompt }],
                model: "gpt-3.5-turbo",
            });
            responseText = completion.choices[0].message.content;
        } else {
            // Fallback if no key provided (for testing/demo without key)
            responseText = "I'm sorry, but I can't connect to my AI brain right now. Please ensure the API key is set up in the backend.";
        }

        res.status(200).json({ message: responseText });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ message: "Failed to generate advice." });
    }
};

module.exports = { getFinancialAdvice };

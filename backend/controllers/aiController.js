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
    
    Instructions:
    1. Provide a concise, actionable, and empathetic response.
    2. Use Markdown formatting for readability:
       - Use **bold** for key terms or numbers.
       - Use bullet points for lists or steps.
    3. Keep paragraphs short and easy to read.
    4. Focus on the 33-33-33 rule if applicable (33% essentials, 33% savings, 33% discretionary).
    5. Do not use complex financial jargon.
    `;

    try {
        let responseText = "";

        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                // Use a stable, generally available model name
                const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                responseText = response.text();
            } catch (geminiError) {
                console.error("Gemini Error:", geminiError);
            }
        }

        // Fallback to OpenAI if Gemini failed or is not configured
        if (!responseText && process.env.OPENAI_API_KEY) {
            try {
                const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: prompt }],
                    model: "gpt-3.5-turbo",
                });
                responseText = completion.choices[0].message.content;
            } catch (openAiError) {
                console.error("OpenAI Error:", openAiError);
            }
        }

        if (!responseText) {
            // Final friendly fallback – never throw a 500 to the client
            responseText =
                "I'm sorry, but I couldn't reach my AI brain right now. You can still follow the 33-33-33 rule: keep essentials in one part, fun in another, and save the rest.";
        }

        res.status(200).json({ message: responseText });
    } catch (error) {
        console.error("AI Error (outer):", error);
        res
            .status(200)
            .json({
                message:
                    "I'm having trouble connecting to the AI service, but you can start by tracking your income and expenses regularly. Try to keep expenses below your income each month.",
            });
    }
};

module.exports = { getFinancialAdvice };

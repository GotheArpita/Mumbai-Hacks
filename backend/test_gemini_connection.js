require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConnection() {
    console.log("Checking GEMINI_API_KEY...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("ERROR: GEMINI_API_KEY is missing in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        console.log("Trying gemini-flash-latest...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const result = await model.generateContent("Hello");
            console.log("gemini-flash-latest Success:", await result.response.text());
        } catch (e) {
            console.error("gemini-flash-latest Failed:", e.message);
        }

    } catch (error) {
        console.error("General Error:", error);
    }
}

testConnection();

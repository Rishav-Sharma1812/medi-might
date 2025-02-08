const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load environment variables

const app = express();
const PORT = 5000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in environment variables");
    process.exit(1); // Stop execution if API key is missing
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

app.use(express.json());
app.use(cors()); // Allow frontend to connect

// API Endpoint to get response from Gemini AI
app.post("/gemini", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const response = await axios.post(GEMINI_URL, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        if (response.data.candidates && response.data.candidates.length > 0) {
            const reply = response.data.candidates[0].content.parts[0].text;
            return res.json({ reply });
        } else {
            return res.status(500).json({ error: "No response received from Gemini API" });
        }
    } catch (error) {
        console.error("Error fetching response:", error.message);
        return res.status(500).json({
            error: "Failed to get response",
            details: error.response?.data || error.message
        });
    }
});

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

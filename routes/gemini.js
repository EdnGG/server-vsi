const express = require('express');
const app = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the model (ideally in a separate configuration file)
const modelConfig = {
  model: "gemini-pro",
  generationConfig: {
    maxOutputTokens: 100,
  }
}

// Create an empty chat history (consider persisting in database or session)
let chatHistory = []; 

// POST endpoint
app.post('/vsi-bot-gemini', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel(modelConfig);
    const chat = model.startChat({ history: chatHistory });

    const { message } = req.body; // Extract message from request body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await chat.sendMessage(message);
    const response = await result.response;

    // Update chat history 
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    chatHistory.push({ role: "model", parts: [{ text: response.text() }] });

    res.json({ response: response.text() });
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = app;

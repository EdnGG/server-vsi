/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
// const bcryptjs = require("bcryptjs");

app.get("/gpt", async (req, res) => {
    res.json({ msg: "Hello" });
});

// app.post("/gpt", async (req, res) => {
//     const { message } = req.body; // OBTENER USUARIO, EMAIL Y PASSWORD DE LA PETICIÓN
//     const { OpenAIGPT } = require('openai-apis');
//     const openai = new OpenAIGPT({ apiKey: process.env.OPENAI_API_KEY });
//     try {
//         const response = await openai.complete({
//         prompt: message,
//         max_tokens: 150,
//         temperature: 0.7,
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//         });
//         res.json({ response });
//     } catch (error) {
//         res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
//     }
// })

module.exports = app; // Exportar la ruta
/* Importing the express module and creating an instance of it. */
const express = require("express");
const app = express.Router();
// const bcryptjs = require("bcryptjs");

app.get("/chatbot-vsi", async (req, res) => {
    res.send("VSI Chatbot API"); 
});

app.post("/chatbot-vsi", async (req, res) => {
    const { message } = req.body; // Obtener el mensaje de la petición
    const { OpenAI } = require("openai");

    // Configuración del cliente de OpenAI
    const configuration = {
        apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que tu clave API está configurada como variable de entorno
    }    
    const openai = new OpenAI(configuration);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Cambia esto por el modelo que quieras usar
            // prompt: message,
            max_tokens: 150,
            temperature: 0.7,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            messages: [{
                role: "user",
                content: message
            }],
        });
        res.json({ response: response.choices[0].message.content}); // Asegúrate de enviar solo la data que necesitas
    } catch (error) {
        console.error(error); // Loguear el error puede ayudarte a debuggear
        res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
    }
});

module.exports = app; // Exportar la ruta
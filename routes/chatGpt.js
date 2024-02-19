/* Importing the express module and creating an instance of it. */
const express = require("express");
const axios = require("axios");
const app = express.Router();

const { OpenAI } = require("openai");

// const bcryptjs = require("bcryptjs");

app.get("/chatbot-vsi", async (req, res) => {
    res.send("VSI Chatbot API"); 
});

app.post("/chatbot-vsi", async (req, res) => {
    const { message } = req.body; // Obtener el mensaje de la petición
    // console.log('message form backend ' , message)
    // const { OpenAI } = require("openai");

    // Configuración del cliente de OpenAI
    const configuration = {
        apiKey: process.env.OPENAI_API_KEY, // Asegúrate de que tu clave API está configurada como variable de entorno
        organization: "org-Qkz6gVwmS9m4Q8v1OtZDbWRV"
    }    
    const openai = new OpenAI(configuration);

    try {
        const response = await openai.chat.completions.create({
            // model: "",
            model: "gpt-4-turbo-preview", // Cambia esto por el modelo que quieras usar
            // como puedo poner de modelo mi propi chat gpt?
            max_tokens: 300,
            temperature: 0.8,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            messages: [{
                role: "user",
                content: message
            }],
        });
        // console.log('response from openai', response.choices[0].message.content)
        res.json({ response: response.choices[0].message.content}); // Asegúrate de enviar solo la data que necesitas
    } catch (error) {
        console.error(error); // Loguear el error puede ayudarte a debuggear
        res.status(500).json({ msg: "Hubo un error obteniendo los datos" });
    }
});

module.exports = app; 
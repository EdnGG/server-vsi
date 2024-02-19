const express = require("express");
const app = express.Router();

const { OpenAI } = require("openai");

app.post("/vsi-bot", async (req, resp) => {
  const { message } = req.body;
  let answer = ''

  const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-Qkz6gVwmS9m4Q8v1OtZDbWRV",
  };
  const openai = new OpenAI(configuration);

  try {
    // CHAT GPT
    // // Asumiendo que "asst_Wu03gXjfzLtPJNS3bWv4FmLo" es el ID de tu asistente personalizado
    // const assistantId = "asst_Wu03gXjfzLtPJNS3bWv4FmLo";

    // // Crear una conversación/completación con el asistente
    // const response = await openai.chat.completions.create({
    //   model: assistantId, // Asegúrate de usar el modelo correcto para tu asistente
    // //   prompt: message, // Mensaje del usuario
    //   temperature: 0.7,
    //   max_tokens: 150,
    //   n: 1,
    //   stop: null,
    // //   assistant: assistantId, // Usar el ID de tu asistente personalizado
    //   messages: [{
    //     role: "user",
    //     content: message
    // }],
    // });

    // // Aquí asumimos que quieres enviar la primera respuesta generada por el asistente
    // if (response.data && response.data.choices && response.data.choices.length > 0) {
    //   const firstResponse = response.data.choices[0].text.trim();
    //   resp.json({ response: firstResponse });
    // } else {
    //   resp.status(500).json({ msg: "No response from the assistant" });
    // }


    // // necesito mandar la respuesta en el resp.json de abajo
    // // resp.json({ response: response.choices[0].message.content});
    // End Chat GPT

    // const assistant = await openai.beta.assistants.create({
    //     name: "Valve Solutions Asisstant",
    //     instructions: "You are a personal assistant for Valve Solutions Inc. You can help with customer service, technical support, and more",
    //     tools: [{ type: "code_interpreter" }],
    //     model: "gpt-4-turbo-preview"
    // });

    const getAssistant = await openai.beta.assistants.retrieve(
      "asst_Wu03gXjfzLtPJNS3bWv4FmLo"
    );
    // console.log("Assistant: ", getAssistant);
    // console.log("Assistant Id: ", getAssistant.id);

    // Create a Thread
    // const thread = await openai.beta.threads.create();
    // console.log('Thread: ', thread)

    // Create a Message
    // const mensaje = await openai.beta.threads.messages.create(thread.id, {
    //   role: "user",
    //   content: message,
    // });
    // console.log("Mensaje: ", mensaje);

    // Create a Run
    // const run = await openai.beta.threads.runs.create(thread.id, {
    //     assistant_id: getAssistant.id,
    //     instructions: "Address the user as Technical"
    // })
    // console.log('Run : ', run)

    // const run  = await openai.beta.threads.runs.retrieve(
    //     'thread_ZFs9CoBxOwlaWwfATdeYjEQ8','run_87uW84wSddVkfimmd6lvNqXL'
    // )
    // console.log('Run 2: ', run)


    const messages = await openai.beta.threads.messages.list('thread_ZFs9CoBxOwlaWwfATdeYjEQ8')
    console.log('Messages: ', messages)

    messages.body.data.forEach(message => {
        answer += message.content[0].text.value
        console.log('ForEach message', message.content)
    });
    // answer
    console.log('Answer: ' , answer)

    // necesito mandar la respuesta en el resp.json de abajo
    resp.json({ response: answer});
  } catch (error) {
    console.error(error);
    resp.status(500).json({ msg: "There was an error getting the data" });
  }
});

module.exports = app;

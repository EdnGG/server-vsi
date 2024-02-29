// const express = require("express");
// const app = express.Router();

// const { OpenAI } = require("openai");

// app.post("/vsi-bot", async (req, resp) => {
//   const { message } = req.body;
//   let answer = ''

//   const configuration = {
//     apiKey: process.env.OPENAI_API_KEY,
//     organization: "org-Qkz6gVwmS9m4Q8v1OtZDbWRV",
//   };
//   const openai = new OpenAI(configuration);

//   try {

//     // const assistant = await openai.beta.assistants.create({
//     //     name: "Valve Solutions Asisstant",
//     //     instructions: "You are a personal assistant for Valve Solutions Inc. You can help with customer service, technical support, and more",
//     //     tools: [{ type: "code_interpreter" }],
//     //     model: "gpt-4-turbo-preview"
//     // });

//     const getAssistant = await openai.beta.assistants.retrieve(
//       "asst_Wu03gXjfzLtPJNS3bWv4FmLo"
//     );

//     // Create a Thread
//     // Comentar para que pueda funcionar
//     // const thread = await openai.beta.threads.create();
//     // console.log('Thread: ', thread)
//     // 'thread_iONpMXqEFbBMTf14E4FyZxM8'

//     // Create a Message
//     const mensaje = await openai.beta.threads.messages.create(
//       // thread.id,
//       'thread_iONpMXqEFbBMTf14E4FyZxM8',
//       {
//       role: "user",
//       content: message,
//     });
//     console.log("Mensaje: ", mensaje);

//     // Create a Run
//     // const run = await openai.beta.threads.runs.create(
//     //   // thread.id,
//     //   'thread_iONpMXqEFbBMTf14E4FyZxM8',
//     //   {
//     //     assistant_id: getAssistant.id,
//     //     instructions: "Address the user as Technical"
//     // })
//     // console.log('Run : ', run)
//     // 'run_Pfys1cJXUT7aJvn8HOwd11BN'

//     // AQUI ESTA EL TRUCO
//     const run2  = await openai.beta.threads.runs.retrieve(
//         // thread.id,run.id
//       'thread_iONpMXqEFbBMTf14E4FyZxM8',
//       'run_Pfys1cJXUT7aJvn8HOwd11BN'
//     )
//     console.log('Run 2: ', run2)
//       // 'thread_iONpMXqEFbBMTf14E4FyZxM8'
//       // 'run_Pfys1cJXUT7aJvn8HOwd11BN'

//     const messages = await openai.beta.threads.messages.list('thread_iONpMXqEFbBMTf14E4FyZxM8',)
//     console.log('Messages: ', messages)

//     messages.body.data.forEach(message => {
//         answer += message.content[0].text.value
//         // answer += message.content

//         console.log('ForEach message', message.content)
//     });
//     // answer
//     console.log('Answer: ' , answer)

//     // necesito mandar la respuesta en el resp.json de abajo
//     resp.json({ response: answer});
//   } catch (error) {
//     console.error(error);
//     resp.status(500).json({ msg: "There was an error getting the data" });
//   }
// });

// module.exports = app;

// CHAT GPT RESPONSE
const express = require("express");
const app = express.Router();
const { OpenAI } = require("openai");

app.post("/vsi-bot", async (req, resp) => {
  const { message } = req.body;

  const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
    organization: "org-Qkz6gVwmS9m4Q8v1OtZDbWRV",
  };
  const openai = new OpenAI(configuration);

  try {
    const getAssistant = await openai.beta.assistants.retrieve("asst_Wu03gXjfzLtPJNS3bWv4FmLo");
    console.log("Assistant: ", getAssistant.id);
    // Aquí deberías decidir si crear un nuevo hilo o usar uno existente de manera dinámica
    // const threadId = 'thread_iONpMXqEFbBMTf14E4FyZxM8'; // Ejemplo fijo, pero podrías crear uno nuevo

    const thread = await openai.beta.threads.create({
      messages:[
        {
          role: "user",
          content: message,
        }
      ]
    //   {
    //   model: "gpt-4-turbo-preview",
    //   assistant_id: "asst_Wu03gXjfzLtPJNS3bWv4FmLo",
    // }
  }
  );

    console.log("Nuevo Hilo Creado: ", thread);

    // Enviar mensaje al hilo
    const messageResponse = await openai.beta.threads.messages.create(
      thread.id,
      {
        role: "user",
        content: message,
      }
    );
    console.log("Message Response: ", messageResponse.content);

    // const run  = await openai.beta.threads.runs.create(thread.id, {
    //   assistant_id: "asst_Wu03gXjfzLtPJNS3bWv4FmLo",
    //   instructions: "Please address the user as VSI-Technical"
    // })
    // console.log('Run : ', run)

    // const retrieve = await openai.beta.threads.runs.retrieve(
    //   thread.id,
    //   run.id
    // );
    // console.log('Retrieve: ', retrieve)

    const messages = await openai.beta.threads.messages.list(thread.id);

    messages.body.data.forEach((message) => {
      console.log("Message: ", message.content);
    });
    // console.log('Messages: ', messages)

    // Suponiendo que quieras la respuesta inmediata del asistente, podrías necesitar ajustar esto para esperar la respuesta
    // const messages = await openai.beta.threads.messages.list(thread.id);

    // let answer = messages.body.data.map(m =>
    //    m.content.join(' '))//.join(' '); // Ajusta según necesites formatear las respuestas
    
    // console.log('Answer: ', answer)
    // resp.json({ response: answer });
  } catch (error) {
    console.error(error);
    resp.status(500).json({ msg: "There was an error getting the data" });
  }
});

module.exports = app;

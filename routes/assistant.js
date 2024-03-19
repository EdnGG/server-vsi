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
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_Wu03gXjfzLtPJNS3bWv4FmLo",
      instructions: "Please address the user as VSI-Technical",
    });
    console.log("Primer run: ", run);

    let checks = 0;
    while (checks < 5) {
      const runCheck = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id
      );
      console.log("Run Check: ", runCheck.status);

      if (runCheck.status === "completed" || runCheck.status === "failed") {
        if (runCheck.status === "completed") {
          const messages = await openai.beta.threads.messages.list(thread.id);
          console.log("Messages: ", messages);
          const runMessages = messages.data.filter((m) => m.run_id === run.id);
          if (runMessages.length > 0) {
            const answer = runMessages[0].content[0].text.value;
            console.log("Answer: ", answer);
            return resp.json({ response: answer });
          }
        }
        // Manejo del caso "failed" o no hay mensajes de respuesta
        return resp.json({
          response:
            "There was an issue processing your request. Please try again.",
        });
      }

      await new Promise((r) => setTimeout(r, 30000));
      checks++;
    }

    // Si se sale del bucle sin completar o fallar
    return resp.status(504).json({ response: "Request timed out." });
  } catch (error) {
    console.error(error.message);
    resp.status(500).json({ msg: "There was an error getting the data" });
  }
});

module.exports = app;

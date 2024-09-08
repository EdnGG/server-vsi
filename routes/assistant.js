// CHAT GPT RESPONSE
const express = require("express");
const app = express.Router();
const { OpenAI } = require("openai");

const getOpenAIClient = () => {

  const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG,
  };
  return new OpenAI(configuration);
}

const checkRunStatus = async (openai, threadId, runId) => {
  let checks = 0;
  while(checks < 6){
    try{
      const runCheck = await openai.beta.threads.runs.retrieve(threadId, runId)
      if(runCheck.status === "completed" ||runCheck.status === "failed"){
        return runCheck
      }
      await new Promise((r) => setTimeout(r, 15000))
      checks++
    }catch(error){
      console.error(`Error checking run status: ${error.message}`)
      throw new Error("Failed to check run status")
    }
  }
  throw new Error("Request timed out after multiple checks")
}

const getAssistantMessages = async (openai, threadId, runId) => {
  try{
    const messages = await openai.beta.threads.messages.list(threadId)
    const runMessages = messages.data.filter((m) => m.run_id === runId)
    if(runMessages.length > 0 ){
      return runMessages[0].content[0].text.value
    }
    throw new Error("No response messages found")

  } catch(error){
    console.error(`Error retrieving messages: ${error.message}`)
    throw new Error("Failed to retrieve messages")
  }
}
  

app.post("/vsi-bot", async (req, resp) => {

  const { message } = req.body;

  if(!message || typeof message!== "string"){
    return resp.status(400).json({response: "Invalid input message provided"})
  }

  const openai = getOpenAIClient()

  try {
    const thread = await openai.beta.threads.create({
      messages: [{role: "user", content: message}]
    })
    
    // Crear la primera ejecución del asistente
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_Wu03gXjfzLtPJNS3bWv4FmLo",
      instructions: "You are a VSI ASSISTANT  that gives information about all products and services we provide to all application needs. Please address the user as VSI-Technical. If user ask about whats the right steps to assemble any assembly? you need to take a look in your knowledge, specifically on file 'Assemblies.json' ",
    });

    console.log("First run: ", run)

    const runCheck = await checkRunStatus(openai, thread.id, run.id)
    if(runCheck.status === "completed"){
      const answer = await getAssistantMessages(openai, thread.id, run.id)
      return resp.json({response: answer})
    }
    // Manejo del caso "failed" o sin respuesta
    return resp.json({
      response: "There was an issue processing your request. Please try again.",
    });


  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    resp.status(500).json({ msg: "There was an error processing your request." });
  }
});

module.exports = app;

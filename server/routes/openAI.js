/** @format */

const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();
const dotenv = require("dotenv").config();

const configuration = new Configuration({
  organization: process.env.ORGANIZATION_KEY,
  apiKey: process.env.API_KEY,
});

const openAi = new OpenAIApi(configuration);

let messagesArray = [];

configureMessage = (message, role) => {
  if (role == "Student") {
    message =
      "I am a learning Student and I just need a hint about " +
      message +
      " and ask me a foundational question to test my knowledge about the same.";
  }
  if (role == "Professor") {
    message =
      "I am a Professor and I need a detailed explanation about  " + message;
  }
  return message;
};

router.get("/statusCheck", async (req, res) => {
  const completion = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: "Am I online?" }],
  });
  if (completion.data.created) {
    res.json(completion.data.choices[0].message);
  }
});

router.post("/query", async (req, res) => {
  let message = req.body.message;
  let role = req.body.role;
  message = configureMessage(message, role);
  messagesArray.push({ role: "user", content: message });
  const completion = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesArray,
  });
  if (completion.data.created) {
    messagesArray.push(completion.data.choices[0].message);
    console.log(messagesArray);
    res.json(completion.data.choices[0].message);
  }
});

module.exports = router;

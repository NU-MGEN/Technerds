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

let configureMessage = (message, role, keywords) => {
  if (role == "Student") {
    message =
      "I am a learning Student and I just need a hint about " +
      message +
      ". If the question is mathematical derivation give me MathJax response else write in Python and provide me the code and give me necessary source links and don't mention whether you can provide answer in Mathjax or python";
    if (keywords.length === 0) {
      message += ".";
    } else {
      message +=
        ". And most importantly, only provide me a response if related to the keywords: ";
      keywords.map((word, index) => {
        message += word;
      });
    }
    message +=
      ". Or else dont give any information and just say that topic is irrelevant. And most importantly, ask me a foundational question to test my knowledge about any concepts in the provided keywords.";
  }
  if (role == "Professor") {
    message =
      "I am a Professor and I need a detailed explanation about  " +
      message +
      ". If the question is mathematical derivation give me MathJax response else write in Python and provide me the code.";
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

router.get("/clearChat", async (req, res) => {
  messagesArray = [{ role: "user", content: "Hello." }];
  console.log("Hit Clear");
  const completion = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messagesArray,
  });
  if (completion.data.created) {
    console.log(messagesArray);
    res.json(completion.data.choices[0].message);
  }
});

router.post("/query", async (req, res) => {
  let message = req.body.message;
  let role = req.body.role;
  let keywords = req.body.keywords;
  message = configureMessage(
    req.body.message,
    req.body.role,
    req.body.keywords
  );
  console.log(message);
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

router.post("/generateImage", async (req, res) => {
  const message = req.body.message;
  const numberOfImages = 1;
  const imageSize = "256x256";
  const completion = await openAi.createImage({
    prompt: message,
    n: numberOfImages,
    size: imageSize,
  });
  res.send(completion.data.data[0]);
});

module.exports = router;

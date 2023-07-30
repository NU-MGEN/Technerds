/** @format */

const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const router = express.Router();

const configuration = new Configuration({
  organization: "org-u23cDyApZqEHCC6UYEI2ucol",
  apiKey: "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",
});

const openAi = new OpenAIApi(configuration);

configureMessage = (message, role) => {
  if (role == "Student") {
    message = "I am a learning Student and I just need a hint about " + message + " and ask me a return question to test my knowledge about the same.";
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
  let role = "Student";
  message = configureMessage(message, role);
  console.log(message);
  const completion = await openAi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });
  if (completion.data.created) {
    res.json(completion.data.choices[0].message);
  }
});

module.exports = router;

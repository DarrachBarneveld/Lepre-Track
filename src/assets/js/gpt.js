import { config } from "dotenv";
config();

console.log(process.env);
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

const askgpt = async () => {
  let inputString = document.querySelector(".input-gpt").value;

  let outputArea = document.querySelector(".gpt-output");
  const chatCompletion = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: randomQ }],
      max_tokens: 30,
    })
    .then((res) => (outputArea.value = res.choices[0].message.content));
};

const randomEnvironmentQuestion = async () => {
  const randomQ =
    "Tell me a random fact about the environment decay, make its a short answer";
  let outputArea = document.querySelector(".gpt-output");
  const chatCompletion = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: randomQ }],
      max_tokens: 30,
    })
    .then((res) => (outputArea.value = res.choices[0].message.content));
};

let gptSubmitBtn = document.querySelector(".gpt-submit");
gptSubmitBtn.addEventListener("click", (e) => {
  e.preventDefault;
  askgpt();
});

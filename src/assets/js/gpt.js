import { collection, getDocs } from "@firebase/firestore";
import { config } from "dotenv";
import { firebaseDB } from "../../config/firebase";
config();

const OpenAI = require("openai");

let openai;
async function init() {
  const { key } = await getGPTKey();

  openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true,
  });
}

init();

export async function getGPTKey() {
  try {
    const userCollectionRef = collection(firebaseDB, "api");
    const querySnapshot = await getDocs(userCollectionRef);

    const key = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      key.push(data);
    });

    return key[0];
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

const askgpt = async () => {
  let inputString = document.querySelector(".input-gpt").value;

  let outputArea = document.querySelector(".gpt-output");
  const chatCompletion = await openai.chat.completions
    .create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: inputString }],
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

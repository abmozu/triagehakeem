import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const assistantId = import.meta.env.VITE_OPENAI_ASSISTANT_ID;

console.log("API Key length:", apiKey?.length);
console.log("Assistant ID:", assistantId);

if (!apiKey) {
  console.error("API Key is missing!");
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export default openai;

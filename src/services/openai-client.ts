import OpenAI from "openai";

console.log("API Key:", import.meta.env.VITE_OPENAI_API_KEY);
console.log("Assistant ID:", import.meta.env.VITE_OPENAI_ASSISTANT_ID);

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Store your API key in an environment variable
  dangerouslyAllowBrowser: true, // Allow the client to run in the browser
});

export default openai;

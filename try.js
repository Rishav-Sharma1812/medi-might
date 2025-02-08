import { GoogleGenerativeAI } from "@google/generative-ai";
 
const GEMINI_API_KEY=AIzaSyCj5RQ403Vjueu7sGTVhKav8Ls07xVrD9s;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = "Tell me a joke"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
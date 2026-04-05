import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyD3fhrmLO4W3szPGMOtf25mYpLtzORZQUY";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await result.json();
    if (data.models) {
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();

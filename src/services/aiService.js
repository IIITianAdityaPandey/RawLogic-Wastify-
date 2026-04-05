import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Analyzes an image of waste/material and returns structured data.
 * @param {string} base64Image - The base64 encoded image string (without the data:image/... prefix)
 * @returns {Promise<Object>} - The analyzed data
 */
export const analyzeMaterialImage = async (base64Image, mimeType = "image/jpeg", userDescription = "") => {
  try {
    // For Gemini 2.5 Flash (optimized for multimodal)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this ${base64Image ? "image and " : ""}description of industrial waste or recyclable material. 
      ${userDescription ? `User description: "${userDescription}".` : ''}
      Identify the material and provide the following details in a strict JSON format:
      {
        "name": "Specific name of the material (e.g., HDPE Plastic Bottles)",
        "category": "Choose from: Metal, Plastic, E-Waste, Glass, Paper, Textile, Organic, Wood, Rubber, Ceramic, Chemical, Composite, Other",
        "condition": "Brief description of its state (e.g., Sorted, Baled, Crushed, Mixed)",
        "purity": "Estimated purity percentage (e.g., 95%)",
        "quantity_estimate": "Logical unit for this type (e.g., 2 Tons, 500 Kg)",
        "description": "Short, professional 2-sentence marketing description for a circular economy marketplace."
      }
      Do not include any markdown formatting like \`\`\`json, just return the raw JSON string.
    `;

    const contents = [prompt];
    if (base64Image) {
      contents.push({
        inlineData: {
          data: base64Image,
          mimeType
        }
      });
    }

    const result = await model.generateContent(contents);

    const response = await result.response;
    const text = response.text();
    
    // Attempt to parse JSON safely
    try {
      // Clean up potential markdown formatting if model ignores instructions
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("AI Response Parsing Error:", text);
      throw new Error("Failed to parse AI analysis results.");
    }
  } catch (error) {
    console.error("AI Analysis Service Error:", error);
    throw error;
  }
};

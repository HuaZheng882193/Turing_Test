import { GoogleGenAI, Chat, GenerateContentResponse, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { EntityType } from '../types';
import { SYSTEM_PROMPTS } from '../constants';

class GeminiService {
  private client: GoogleGenAI | null = null;
  private chat: Chat | null = null;
  
  constructor() {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      this.client = new GoogleGenAI({ apiKey });
    } else {
      console.error("API_KEY is missing from environment variables.");
    }
  }

  initializeChat(entityType: EntityType) {
    if (!this.client) {
        // Fallback or error handling if no key
        throw new Error("API Key not initialized");
    }

    // Randomize temperature slightly for variety
    const temperature = entityType === 'human' ? 1.2 : 0.7;

    this.chat = this.client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_PROMPTS[entityType],
        temperature: temperature,
        topP: 0.95,
        topK: 40,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        ],
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error("Chat not initialized");
    }

    try {
      const response: GenerateContentResponse = await this.chat.sendMessage({ 
        message 
      });
      
      const text = response.text;
      
      if (!text) {
        return "..."; 
      }
      
      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "连接错误... [信号丢失]";
    }
  }
}

export const geminiService = new GeminiService();
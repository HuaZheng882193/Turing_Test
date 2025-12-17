import { EntityType } from '../types';
import { SYSTEM_PROMPTS } from '../constants';

// Define types for OpenAI-compatible API message structure
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class GeminiService {
  private messages: OpenAIMessage[] = [];
  // Note: Using the provided API key directly. In a production environment, use environment variables or a backend proxy.
  private apiKey: string = "sk-lwmzizblpraoghacxfqkgqvavbhqpweavsefkrtytulbiegr";
  private baseUrl: string = "https://api.siliconflow.cn/v1";
  // Corrected generic Model ID for stability
  private model: string = "deepseek-ai/DeepSeek-V3";
  private temperature: number = 0.7;
  private topP: number = 0.95;

  constructor() {
    // Service initialization
  }

  initializeChat(entityType: EntityType) {
    this.messages = [];
    
    // Set system prompt
    this.messages.push({
      role: 'system',
      content: SYSTEM_PROMPTS[entityType]
    });

    // Introduce randomization to generation parameters to prevent stale responses
    if (entityType === 'human') {
        // Human: Higher temperature for DeepSeek to encourage creativity/slang
        // DeepSeek handles high temp well without breaking as easily as older models
        this.temperature = 1.3; 
        this.topP = 0.90;
    } else {
        // AI: Standard consistency
        this.temperature = 0.6;
        this.topP = 0.95;
    }
  }

  async sendMessage(message: string): Promise<string> {
    // Add user message to history
    this.messages.push({ role: 'user', content: message });

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: this.messages,
          temperature: this.temperature,
          top_p: this.topP,
          max_tokens: 512, // Reduced max tokens to encourage brevity for human persona
          stream: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.statusText}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullText = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            const dataStr = line.trim().slice(6);
            if (dataStr === '[DONE]') continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.choices && data.choices[0]?.delta?.content) {
                fullText += data.choices[0].delta.content;
              }
            } catch (e) {
              console.warn("Error parsing stream chunk", e);
            }
          }
        }
      }

      // Append assistant response to history
      if (fullText) {
        this.messages.push({ role: 'assistant', content: fullText });
        return fullText;
      } else {
        return "..."; 
      }

    } catch (error) {
      console.error("DeepSeek API Error:", error);
      return "连接错误... [信号丢失]";
    }
  }
}

export const geminiService = new GeminiService();
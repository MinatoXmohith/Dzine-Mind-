import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role, Attachment, DesignMode } from "../types";
import { SYSTEM_INSTRUCTION, MODE_CONFIGS } from "../constants";

// Helper to convert internal message format to Gemini content format
const formatHistory = (messages: Message[]) => {
  return messages.map(msg => {
    const parts: any[] = [];
    
    // Add text
    if (msg.content) {
      parts.push({ text: msg.content });
    }

    // Add image if exists
    if (msg.attachment) {
      parts.push({
        inlineData: {
          mimeType: msg.attachment.mimeType,
          data: msg.attachment.data
        }
      });
    }

    return {
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: parts
    };
  });
};

export const sendMessageToGemini = async (
  messages: Message[], 
  currentMode: DesignMode,
  latestPrompt: string,
  attachment: Attachment | null
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // We use gemini-2.5-flash for a good balance of reasoning and speed.
    const modelId = "gemini-2.5-flash";

    // Prepare history.
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
      history: formatHistory(messages)
    });

    // Enforce the current "Mode" by prepending a hidden instruction to the user's prompt.
    const modeInstruction = `[SYSTEM NOTE: ${MODE_CONFIGS[currentMode]}]`;
    
    const messageParts: any[] = [
      { text: `${modeInstruction}\n\n${latestPrompt}` }
    ];

    if (attachment) {
      messageParts.unshift({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data
        }
      });
    }

    // Use 'message' property as per SDK guidelines for Chat
    const result: GenerateContentResponse = await chat.sendMessage({
      message: messageParts
    });

    return result.text || "I have analyzed the request but cannot articulate a response at this moment.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
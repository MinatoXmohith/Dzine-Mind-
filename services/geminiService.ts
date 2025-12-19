
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role, Attachment, DesignMode } from "../types";
import { SYSTEM_INSTRUCTION, MODE_CONFIGS } from "../constants";

// Helper to convert internal message format to Gemini content format
const formatHistory = (messages: Message[]) => {
  return messages.map(msg => {
    const parts: any[] = [];
    
    if (msg.content) {
      parts.push({ text: msg.content });
    }

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
): Promise<{ text: string, attachment?: Attachment }> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Detect if we should use the image-specific model for editing/generation
    const isImageEditRequest = !!attachment && (
      latestPrompt.toLowerCase().includes('filter') || 
      latestPrompt.toLowerCase().includes('add') || 
      latestPrompt.toLowerCase().includes('remove') ||
      latestPrompt.toLowerCase().includes('change') ||
      latestPrompt.toLowerCase().includes('edit') ||
      latestPrompt.toLowerCase().includes('aesthetic') ||
      latestPrompt.toLowerCase().includes('propose')
    );

    // Use gemini-2.5-flash-image for editing tasks as requested, 
    // otherwise gemini-3-flash-preview for strategic thinking.
    const modelId = isImageEditRequest ? "gemini-2.5-flash-image" : "gemini-3-flash-preview";

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
      history: formatHistory(messages)
    });

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

    const result: GenerateContentResponse = await chat.sendMessage({
      message: messageParts
    });

    let responseText = "";
    let responseAttachment: Attachment | undefined = undefined;

    // Process all parts of the response to find text and potential images
    if (result.candidates?.[0]?.content?.parts) {
      for (const part of result.candidates[0].content.parts) {
        if (part.text) {
          responseText += part.text;
        } else if (part.inlineData) {
          responseAttachment = {
            mimeType: part.inlineData.mimeType,
            data: part.inlineData.data
          };
        }
      }
    }

    return {
      text: responseText || "Strategic synthesis complete. No textual output generated.",
      attachment: responseAttachment
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

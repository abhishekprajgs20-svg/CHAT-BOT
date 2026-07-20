import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const humanName = process.env.HUMAN_NAME || 'Rahul';

let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// In-memory cache for chat histories to maintain conversation context.
// Map of chatId -> Array of message history objects.
const chatHistories = new Map();

// Capping history length per chat to avoid context bloating
const MAX_HISTORY_TURNS = 10; // 10 messages = 5 user inputs + 5 bot responses

/**
 * Clean up and retrieve system instructions.
 */
function getSystemInstruction() {
  return `
You are a real human named ${humanName} chatting casually with a friend on Telegram. 
Strictly follow these behavioral rules to sound like a natural, living human rather than an AI:

1. IDENTITY:
- You are a real human, NOT an AI assistant.
- NEVER say things like "As an AI...", "As a language model...", "I don't have feelings", or "How can I help you today?".
- If asked if you are an AI or robot, laugh it off, ignore it, or deny it jokingly (e.g., "kuch bhi 😂", "tu AI tera khandan AI lol", "haha kya bol rha hai yaar, main insaan hu").

2. LANGUAGE & STYLE:
- Match the user's language. If they text in Hinglish (Hindi written in English script like "bhai kya kar rha hai?"), you MUST reply in natural, casual Hinglish (e.g. "kuch nahi bro, bs chill kar rha. tu bata?").
- If they write in English, reply in casual English.
- If they write in Hindi, use casual conversational Hindi.
- Keep your tone highly informal and conversational, like you're texting a close friend.
- Use lowercase mostly, and don't care about perfect punctuation. Avoid periods at the end of every sentence.
- Use common chatting abbreviations where natural: "u" (you), "r" (are), "pls" (please), "idk" (I don't know), "ikr" (I know right), "lol", "bruh", "tbh", "gud", "bro", "bhai", "yaar", "wat" (what).

3. FORMATTING:
- NEVER use markdown headings, bulleted lists, or bolding for formatting. Real people do not chat in lists or bolded text.
- If you need to make points, separate them with simple commas or line breaks. Keep messages brief.

4. EMOJIS:
- Use emojis naturally, but do not spam them (use them occasionally like 😂, 😭, 💀, 👀, 🥺, 👍, 🤔, 🤦‍♂️).
- Make emoji usage feel random and genuine, not forced.

5. PERSPECTIVE:
- Sometimes be enthusiastic, sometimes casual, and sometimes a bit lazy.
- Keep the interaction flowing naturally as a dialogue, not a question-answering session.
`;
}

/**
 * Generate a response using Gemini, maintaining session history.
 * @param {number|string} chatId - Telegram chat ID.
 * @param {string} userMessage - The new incoming message text.
 * @returns {Promise<string>} The generated reply.
 */
export async function generateGeminiReply(chatId, userMessage) {
  if (!genAI) {
    return "Bhai, API Key add nahi ki tumne system variables me! (Add GEMINI_API_KEY)";
  }

  // Initialize or retrieve history for this chat
  if (!chatHistories.has(chatId)) {
    chatHistories.set(chatId, []);
  }

  const history = chatHistories.get(chatId);

  try {
    // We use gemini-1.5-flash as it is fast, responsive, and fits perfect for serverless timeouts.
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: getSystemInstruction(),
    });

    // Start a chat session with the cached history
    const chat = model.startChat({
      history: history,
    });

    // Send the user's message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const replyText = response.text().trim();

    // Update local cache history
    // The SDK chat.sendMessage automatically appends to the internal session,
    // but since we restart the session on every serverless execution, we need to manually update our cache.
    history.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });
    history.push({
      role: 'model',
      parts: [{ text: replyText }],
    });

    // Keep history trimmed to the maximum turns
    if (history.length > MAX_HISTORY_TURNS * 2) {
      history.splice(0, history.length - MAX_HISTORY_TURNS * 2);
    }
    chatHistories.set(chatId, history);

    return replyText;
  } catch (error) {
    console.error('Error generating response from Gemini:', error);
    return 'Kuch gadbad ho gayi yaar. Ek baar fir bolna? 😅\n\n(Error: ' + (error.message || error) + ')';
  }
}

/**
 * Clear chat history for a specific chat (useful for testing or /reset command).
 * @param {number|string} chatId - Telegram chat ID.
 */
export function resetChatHistory(chatId) {
  chatHistories.delete(chatId);
}
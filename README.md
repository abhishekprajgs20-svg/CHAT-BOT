# 🤖 Telegram Human-Like Chatbot (Vercel Ready)

Yeh ek super realistic, natural aur human-like Telegram Chatbot hai jo **Google Gemini API** ka use karta hai. Isko is tarah design kiya gaya hai ki jab aap isse baat karein, to yeh robotic AI ki tarah behave nahi karega balki bilkul ek normal dost ki tarah reply karega.

## ✨ Features

- **💬 Real Human Tone**: Robotic/formal language ki jagah casual Hinglish aur lowercase text me normal reply karega.
- **⚡ Typing status simulation**: Reply karne se pehle chat me "typing..." dikhega, jisse user ko lagega koi sach me type kar rha hai.
- **🎲 Random Short Answers**: Kuch messages par bina AI ko call kiye randomly short answers dega (e.g. "lol", "bruh", "hmm", "yup", "ok") jaise real chat me hota hai.
- **🎭 Context Awareness**: In-memory message history use karke purani baaton ka reference yaad rakhta hai.
- **🚀 Vercel Serverless Ready**: Single-endpoint serverless setup jo Vercel par deploy karne ke liye optimized hai.
- **💻 Local Testing Mode**: Webhook setup ke bina local computer par test karne ke liye polling method code available hai.

---

## 🛠️ Step-by-Step Setup Guide

### 1. Telegram Bot Token Kaise lein?
1. Telegram par `@BotFather` search karein aur chat start karein.
2. `/newbot` command send karein.
3. Bot ka **Name** aur fir ek unique **Username** enter karein (username ke end me `bot` hona zaroori hai, e.g. `MeraDostBot`).
4. `@BotFather` aapko ek **HTTP API Token** dega. Ise copy kar lein. Yeh aapka `TELEGRAM_BOT_TOKEN` hai.

### 2. Gemini API Key Kaise lein?
1. Google AI Studio par jayein: [https://aistudio.google.com/](https://aistudio.google.com/)
2. Apne Google account se sign in karein.
3. **"Get API key"** par click karke ek new API Key generate karein aur copy kar lein. Yeh aapka `GEMINI_API_KEY` is file.

### 3. Project Configuration (Local Setup)
Aapke computer me **Node.js** installed hona chahiye.

1. **Active Workspace**: Is directory ko apna active workspace set kar lein:
   `C:\Users\pc\.gemini\antigravity-ide\scratch\telegram-human-bot`
2. **Setup Environment**: Directory me `.env` name ki ek file banayein aur usme niche diye gaye details fill karein (aap `.env.example` file ko copy kar sakte hain):
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   HUMAN_NAME=Rahul   # Aapka bot jo name use karega
   ```
3. **Install Dependencies**: Terminal open karein (isi folder me) aur command run karein:
   ```bash
   npm install
   ```

---

## 💻 Local Run & Testing

Aap local machine par bot ko bina kisi public URL or webhooks ke run kar sakte hain (yeh polling method use karta hai):

1. Local terminal me commands run karein:
   ```bash
   npm start
   ```
   *Ya fir direct command:*
   ```bash
   node local.js
   ```
2. Telegram par apne bot ko search karke `/start` message bhejkar chat shuru karein!
3. Conversation clear karne ke liye `/reset` command send kar sakte hain.

---

## 🚀 Vercel Par Deploy Kaise Karein?

Vercel par deploy karna behad aasan hai:

### Step A: Deploy to Vercel
1. Apne project folder ko Github par push karein.
2. Vercel dashboard par jayein ([https://vercel.com/](https://vercel.com/)) aur **Add New Project** par click karein.
3. Apne Github repository ko import karein.
4. Deployment settings me **Environment Variables** add karein:
   - `TELEGRAM_BOT_TOKEN` = (Aapka Telegram Token)
   - `GEMINI_API_KEY` = (Aapka Gemini API Key)
   - `HUMAN_NAME` = (Aapka custom bot name)
5. **Deploy** button par click karein. Deploy hone ke baad Vercel aapko ek domain dega (e.g. `https://my-telegram-bot.vercel.app`).

### Step B: Telegram Webhook Set Karein
Deploy karne ke baad Telegram ko batana hoga ki messages kaha bhejne hain. Iske liye web browser me yeh URL open karein:

```
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=<YOUR_VERCEL_APP_URL>/api/webhook
```

- `<YOUR_TELEGRAM_BOT_TOKEN>` ko apne Telegram Bot token se replace karein.
- `<YOUR_VERCEL_APP_URL>` ko apne Vercel deploy domain (e.g. `https://my-telegram-bot.vercel.app`) se replace karein.

**Example URL looks like:**
`https://api.telegram.org/bot123456789:ABCdefGhI/setWebhook?url=https://my-telegram-bot.vercel.app/api/webhook`

Aapko browser screen par ye response milega:
```json
{
  "ok": true,
  "result": true,
  "description": "Webhook was set"
}
```
**Bas kaam khatam!** Aapka Telegram bot ab Vercel Serverless Function par live hai aur jab bhi koi chat message aayega, ye automatic aur extremely human-like reply dega.
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// 1. 從環境變數讀取 BOT_TOKEN 與 PORT
const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN) {
  console.error("Error: BOT_TOKEN not found in environment variables.");
  process.exit(1);
}

// 2. 建立 Express app
const app = express();
app.use(express.json()); // 用於解析 JSON 格式的請求 body

// 3. 建立 Telegram Bot (Webhook 模式)
const bot = new TelegramBot(TOKEN, { polling: false });

// 4. 定義 Webhook 路由（Telegram 會以 POST 傳送更新）
app.post("/telegram-webhook", (req, res) => {
  console.log("[Webhook] Received update:", req.body);
  bot.processUpdate(req.body);
  res.status(200).json({ ok: true });
});

// 5. 定義 Bot 的消息處理邏輯，例如接收到 /start 指令回覆一個訊息
bot.on("message", (msg) => {
  if (msg.text === "/start") {
    bot.sendMessage(msg.chat.id, "Hello! This is a Render-based Telegram Bot. 🎉");
  }
});

// 6. 啟動 Express 伺服器
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

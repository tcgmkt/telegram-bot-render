const express = require("express");
const TelegramBot = require("node-telegram-bot-api");

// 從環境變數讀取 BOT_TOKEN 與 PORT
const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN) {
  console.error("Error: BOT_TOKEN not found in environment variables.");
  process.exit(1);
}

const app = express();
app.use(express.json()); // 解析 JSON 請求

// 建立 Telegram Bot (使用 webhook 模式，polling 設為 false)
const bot = new TelegramBot(TOKEN, { polling: false });

// 當 Telegram 傳送更新時，這個路由會接收到
app.post("/telegram-webhook", (req, res) => {
  console.log("[Webhook] Received update:", req.body);
  bot.processUpdate(req.body);
  res.status(200).json({ ok: true });
});

// 當 Bot 收到 /start 訊息時，回覆一條訊息，並附上 inline keyboard 按鈕
bot.on("message", (msg) => {
  if (!msg.text) return;

  if (msg.text === "/start") {
    const chatId = msg.chat.id;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: "開啟 Web App",
            web_app: {
              url: "https://www.8810255.com/m/index.html"
            }
          }
        ]
      ]
    };

    bot.sendMessage(chatId, "點擊下方按鈕開啟 Web App", { reply_markup: replyMarkup });
  }
});

// 啟動 Express 伺服器
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

# TelegramBotTest 

🔨 Getting Started

Before you start, you need to talk to @BotFather on Telegram. Create a new bot, acquire the bot token and get back here.

Bot token is a key that required to authorize the bot and send requests to the Bot API. Keep your token secure and store it safely, it can be used to control your bot. It should look like this:

1234567:4TT8bAc8GHUspu3ERYn-KGcvsvGB9u_n4ddy

🚧 Supported Platforms
This project using Node JS & MYSQL version	5.7.36

📦 Installation Procedures
1. Please clone the project codes and install the following packages by using npm install:
telegraf
mysql2
dotenv
moment

2. Run Betting.sql script in MYSQL database to create schema and table
3. In .env file, edit the suitable username, password and Bot Token for your BOT
4. Type 'node index.js' under the installed folder
5. For long term running, suggest you to use PM2 to keep the job running on server.

✅ Correctness & Testing
Search the BOT username that you registered using @BotFather and include it in your telegram group.
Following are commands from the BOT:
/start
It will reply a greeting message and then appear inline buttons
After user click the buttons then they can get their account info such as user ID

/round
It will start a flow and all the messages within the flow will be stored to database
within the flow will have 3 actions:
1. post introduction after 3 seconds
2. post a dice emoji in next 2 seconds
3. post back the messages collected during the round in next 3 seconds

/bet
It will return an image

🗂 References
Telegraf (https://github.com/telegraf/telegraf)

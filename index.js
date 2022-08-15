const {Telegraf, Markup, Telegram} = require('telegraf')
const mysql = require('mysql2');
const env = require("dotenv").config();
const MOMENT= require( 'moment' );
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN)

let queryInsert = `INSERT INTO messagehistory (updated_at, userid, chatid, groupid, username, message, created_at) VALUES (now(),?,?,?,?,?,?)`;
let querySelect = `SELECT message FROM messagehistory WHERE userId = ? AND chatId = ? and created_at = ?`;

const Tele = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE, 
    port: process.env.DB_PORT, 
})
Tele.connect(function(err){
    if (err){
        console.log(err)
    } else {
        console.log('Connected Bettting DB')
    }
});

bot.start((ctx) => {
    const username = ctx.chat.first_name;
    ctx.reply(`Hello ${username}, Welcome to this group!`,
    Markup.inlineKeyboard([
        [Markup.button.callback('Photo','info')],
        [Markup.button.callback('Userid','userid')]
    ]))
})

bot.command('round', (ctx) => {
    const chatID = ctx.chat.id;
	const userID = ctx.from.id;
    const username = ctx.chat.first_name;

    // Using context shortcut
    ctx.reply(`Round Started!!`)
    let starttime = MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' );

    bot.on('text', (ctx) => {
        const inchatID = ctx.chat.id;
        const iusername = ctx.chat.first_name;
        const inuserID = ctx.from.id;
        const message = ctx.message.text;

        //Record the messages to database
        Tele.query(
            queryInsert, [inuserID, inchatID, chatID, iusername, message, starttime],
                (err,Tele) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Inserted message '${message}' in database for ${username}`)
                }}
        )
    })

    setTimeout(function(){
        ctx.reply('This is our introduction ')
    },3000);

    setTimeout(function(){
        ctx.reply('🎲')
    },5000);

    setTimeout(function(){
        let displayed = "";
        /*try{
            if('message' in upd.callback_query){
                if("text" in upd.callback_query.message){
                console.log(upd.callback_query.message?.text)
                }   
            }
           }
           catch(error){
             console.log(error)
           }*/

        Tele.query(querySelect, [userID, chatID, starttime], function(err, rows, fields){
        if (err) throw err;
        //console.log(rows.length);
        if (rows.length>0) {
            const result = (JSON.parse(JSON.stringify(rows)));
            
            for (let i = 0; i < rows.length; i++) {
                displayed += result[i].message + "|";
              }
            
            console.log(`Selected message '${displayed}' in database for ${username}`)
            // Explicit usage
            ctx.telegram.sendMessage(ctx.message.chat.id, `${username} said: [${displayed} in this round`)
        }})    
    },8000);
    
})

bot.command('bet', ctx => {
    bot.telegram.sendPhoto(ctx.chat.id,
        {
            source: 'res/betting-image.jpeg'
        },
        {
            reply_to_message_id: ctx.message.message_id
        }
    )
})

bot.action('info', async (ctx) => {
    bot.telegram.sendPhoto(ctx.chat.id,
        {
            source: 'res/Betting_Online.jpeg'
        }
    )
})

bot.action('userid', async (ctx) => {
    const userID = ctx.from.id;
    ctx.telegram.sendMessage(ctx.chat.id, `Your User ID: ${userID}`);
})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

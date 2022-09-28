const { Telegraf, Stage, session } = require("telegraf");
const WizardScene = require("telegraf/scenes/wizard");
const mysql = require("mysql");
const request = require('request');

require("dotenv").config()
const token = process.env.api
const bot = new Telegraf(token)

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tiktok"
});

bot.command("start", async (ctx) => {
    try {
        con.connect(async (err) => {
            const sql = `SELECT COUNT(*) FROM users WHERE chat_id = ${ctx.from.id}`;
            con.query(sql, async (err, result) => {
            //   console.log(result[0]['COUNT(*)'])
            //   console.log(ctx.from.id)
              // console.log(result)
              if (result[0]['COUNT(*)'] === 0) {
                  const sql = `INSERT INTO users (chat_id, first_name, username) VALUES ("${ctx.from.id}","${ctx.from.first_name}","@${ctx.from.username}")`;
                  con.query(sql)
                //   console.log("Foydalanuvchi Bazaga Qo'shildi....")
                } else {
                //   console.log("Foydalanuvchi Bazada Mavjud ....")
              }
            });
          });
        await ctx.replyWithHTML(`👋 Hi, ${ctx.message.from.first_name}!\n🔥 Send me tiktok video link!\n🎞 Bot will send you video!`)
    } catch (error) {
        console.log("Error: ",error)
    }
})

bot.on("message", async (ctx) => {
    try {
        await ctx.replyWithChatAction("upload_video")
        const link = ctx.update.message.text
        let llink = link.split('')
        if (llink[0] === "h", llink[1] === "t", llink[2] === "t", llink[3] === "p", llink[4] === "s",llink[5] === ":", llink[6] === "/", llink[7] === "/", llink[8] === "v", llink[9] === "m",llink[10] === ".", llink[11] === "t", llink[12] === "i", llink[13] === "k", llink[14] === "t") {
            const options = {
                method: 'GET',
                url: 'https://tiktok-downloader-download-videos-without-watermark1.p.rapidapi.com/media-info/',
                qs: {link: link},
                headers: {
                  'X-RapidAPI-Key': '0390edd038msh43715b569645b4cp1bb1a7jsn5093b1f861d3',
                  'X-RapidAPI-Host': 'tiktok-downloader-download-videos-without-watermark1.p.rapidapi.com',
                  useQueryString: true
                }
            };
              
            request(options, async (error, response, body) => {
                if (error) throw new Error(error);
                const data = JSON.parse(body)
                const video = data.result.video.url_list[0]
                const music = data.result.music.url_list[0]
                await bot.telegram.sendVideo(ctx.chat.id, `${video}`)
                await bot.telegram.sendAudio(ctx.chat.id, `${music}`)
            });
        } else if (link === "/stats") {
            try {
                con.connect(async (err) => {
                const sql = `SELECT COUNT(*) FROM users`;
                con.query(sql, async (err, result) => {
                    if (result[0]['COUNT(*)']) {
                    await ctx.replyWithHTML(`👤 Number of users: ${result[0]['COUNT(*)']}`)
                    }
                })
                })
            } catch (e) {
                console.log("Something went wrong...",e)
            }
        } else {
            await ctx.replyWithHTML(`🙏 Please enter valid url!`)
        }
    } catch (error) {
        console.log("Error: ",error)
    }
})


bot.command("help", async (ctx) => {
try {
    await ctx.replyWithHTML(`
/start - Restart
/help - Help
/stats - Bot statistics
`)
} catch (e) {
    console.error("Cant handle start command", e)
}
})

bot.telegram.setMyCommands([
{command: "help", description: "Help"},
{command: "start", description: "Restart"},
{command: "stats", description: "Bot statistics"},
])
  
bot.launch().then( async () => {
console.log(`bot started on @${bot.options.username}`)
})
const Telegraf = require('telegraf');

const bot = new Telegraf('1114073624:AAFYFY_UCuw3u6EGi9Ry6cvqS2fq1AAFN-Y');

const axios = require('axios');

const helpMessage = `
Напиши мне что-нибудь:
/start - начну работать
/help - список команд
/cat - пришлю тебе рандомного котика
/cat + текст - котика с подписью
/fact - разъебет по фактам
`;

bot.command('cat', async (ctx) => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");

    if (inputArray.length === 1) {
        try {
            let res = await axios.get('https://aws.random.cat/meow');
            /*console.log(res.data.file);*/
            ctx.replyWithPhoto(res.data.file);
        } catch (e) {
            console.log(e);
        }
    } else {
        inputArray.shift();
        input = inputArray.join(" ");
        /*ctx.replyWithPhoto(https://cataas.com/cat/says/${input});*/
    }
});

let dataStore = [];

getData();

bot.command('fact', ctx => {
    let maxRow = dataStore.filter(item => {
        return (item.row == '1' && item.col == '2');
    })[0].val
    /*console.log(maxRow);*/
    let k = Math.floor(Math.random() * maxRow) + 1;

    let fact = dataStore.filter(item => {
        return(item.row == k && item.col == '5');
    })[0];

    /*console.log(fact);*/
    let message =
        `
Факт #${fact.row}:
${fact.val}
`;
    ctx.reply(message)
});

bot.command('update', async ctx => {
    try {
        await getData();
        ctx.reply('updated');
    } catch (err) {
        ctx.reply('Error encountered');
    }
});

async function getData() {
    try {
        let res = await  axios('https://spreadsheets.google.com/feeds/cells/1B27Dkz1XeQcUu0R_FZVeG1rvwspdxFRfXKywFC2jAws/1/public/full?alt=json');
        /*console.log(res.data.feed.entry);*/
        let data = res.data.feed.entry;
        dataStore = [];
        data.forEach(item => {
            dataStore.push({
                row: item.gs$cell.row,
                col: item.gs$cell.col,
                val: item.gs$cell.inputValue,
            })
        });
        console.log(dataStore);
    } catch(err) {
        console.log(err);
        throw new Error;
    }
}


bot.start((ctx) => {
    ctx.reply(ctx.from.first_name + " " + "привет! ");
    ctx.reply(helpMessage);
});

bot.help((ctx) => {
    ctx.reply(helpMessage);
});


bot.command('kisel', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, {source: "img/kisel.jpg"});
});

bot.hears(["мой интернет", "мой инет"], (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, {source: "img/my_inet.jpg"});
});

bot.hears(["шлюхи", "Шлюхи"], (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, {source: "img/whore.jpg"});
});

bot.hears(["деньги", "Деньги", "кэш", "Кэш"], (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, {source: "img/money.jpg"});
});

bot.hears(["Да", "да"], (ctx) => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo");
    bot.telegram.sendPhoto(ctx.chat.id, {source: "img/yes.jpg"});
});


bot.launch();

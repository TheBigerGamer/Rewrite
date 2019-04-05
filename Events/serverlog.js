const MODLOG = require("../config").MODLOG;
const bot = require("../bot");


bot.on("channelCreate", async channel => {
    if (!channel.guild) return;
    if (await disabled("channelCreate", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Canal criado")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Canal", channel)
        .addBetterField("Tipo", channel.type)

    return send(embed, ml);
})

bot.on("channelDelete", async channel => {
    if (!channel.guild) return;
    if (await disabled("channelCreate", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Canal eliminado")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Canal", channel.name)

    return send(embed, ml);
})

bot.on("channelUpdate", (old, channel) => {
    if (!old.guild || !channel.guild) return;

    if (old.name !== channel.name) return channelUpdateName(old, channel);
    if (old.topic !== channel.topic) return channelUpdateTopic(old, channel);
})

async function channelUpdateTopic(old, channel) {
    if (await disabled("channelUpdateName", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Tópico do canal alterado")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Canal", channel)
        .addBetterField("Original", old.topic, true)
        .addBetterField("Editado", channel.topic);

    return send(embed, ml);
}

async function channelUpdateName(old, channel) {
    if (await disabled("channelUpdateName", channel.guild)) return;
    const ml = await modlog(channel.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Nome do canal alterado")
        .setAuthor(channel.guild.name, channel.guild.iconURL())
        .addBetterField("Canal", channel)
        .addBetterField("Original", old.name, true);

    return send(embed, ml);
}

bot.on("messageDeleteBulk", async messages => {
    const m = messages.first();
    if (!m) return;
    if (await disabled("messageBulkDelete", m.guild)) return;
    const ml = await modlog(m.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Purga efetuada")
        .setAuthor(m.guild.name, m.guild.iconURL())
        .addBetterField("Canal", m.channel)
        .addBetterField("Número", messages.size, true)

    return send(embed, ml);
})

bot.on("messageDelete", async message => {
    if (message.author.bot) return;
    if (await disabled("messageDelete", message.guild)) return;
    const ml = await modlog(message.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Mensagem eliminada")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addBetterField("Canal", message.channel)
        .addBetterField("Conteúdo", message.content.substr(0, 900), true);

    let atts = attachs(message);
    if (atts) embed.addBetterField("Attachments", atts)

    return send(embed, ml);
})

bot.modlog.on("messageEdit", async (oldMessage, message) => {
    if (oldMessage.content === message.content) return;
    if (message.author.bot) return;
    if (await disabled("messageEdit", message.guild)) return;
    const ml = await modlog(message.guild);
    if (!ml) return;

    const embed = bot.embed
        .setTitle("Mensagen editada")
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .addBetterField("Canal", message.channel)
        .addBetterField("Original", oldMessage.content.substr(0, 900), true)
        .addBetterField("Editada", message.content.substr(0, 900))

    let atts = attachs(message);
    if (atts) embed.addBetterField("Attachments", atts);

    return send(embed, ml);
})

async function modlog(guild) {
    const ml = await guild.serverlog();
    if (!ml) return;
    const chan = bot.channels.get(ml);
    if (!chan) return;
    const perms = chan.permissionsFor(bot.user);
    if (!perms.has("SEND_MESSAGES") || !perms.has("EMBED_LINKS")) return;
    return chan;
}

async function send(embed, ml) {
    embed.nitroColor()
        .setTimestamp(new Date());

    try {
        return ml.send(embed);
    } catch {}
}

function attachs(message) {
    if (!message.attachments.size) return null;
    return Array.from(message.attachments.values()).map(a => a.url).join(", ");
}

async function disabled(event, inGuild) {
    const events = await inGuild.disabledEvents();
    return !!events[event];
}

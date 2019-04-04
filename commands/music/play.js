const { Command } = require("../../Nitro");

class PlayCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            search: YTSearchCommand,
            searchlist: SearchListCommand,
            scsearch: SCSearchCommand,
            link: LinkCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de música para ouvires música.");

        const [sub] = message.args;
        this.runSubCommand(sub);
    }

    help = "Põe uma música a tocar";
    alias = "join";
    cooldown = 10;
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "search",
        endWithoutRest: true
    }
}

class SearchListCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;
        const vc = message.member.voiceChannel;
        
        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.search("ytsearch: " + query);
        } catch {
            return reply.warn("Pesquisa revelou 0 resultados.");
        }

        const items = trackData.slice(0, 5);
        const embed = bot.embed
            .setTitle("Pesquisa no Youtube")
            .setFooter("Seleciona uma faixa pelo seu número.")
            .nitroColor()
        items.forEach((item, i) => {
            embed.addBetterField(i + 1, `[${item.title}](${item.url})`);
        })
        await reply(embed);

        const filter = m => m.author.id === message.author.id;
        try {
            const col = await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] });
            var num = parseInt(col.first().content) || null;
        } catch {
            return reply.edit("**Cancelado.**", { embed: null });
        }

        if (!num || num < 1 || num > items.length)
            return reply.edit("**Cancelado.**", { embed: null });

        let track = items[num - 1];
        player.queueTrack(track);
        return reply.edit(formatMessage(track, message.author));
    }

    help = "Pesquisa no YouTube e escolhe numa lista."
    arg = {
        type: "string",
        typeText: "query",
        info: "O termo de pesquisa.",
        example: "High Hopes.",
        max: 200
    }
}

class YTSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;

        const vc = message.member.voiceChannel;

        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.playSearch("ytsearch: " + query);
        } catch {
            return reply.warn("Não foram encontradas faixas.");
        }

        return reply(formatMessage(trackData, message.author));
    }

    help = "Pesquisa no YouTube.";
    arg = {
        type: "string",
        typeText: "query",
        info: "O termo de pesquisa.",
        example: "High Hospes.",
        max: 200
    }
}

class SCSearchCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;

        const vc = message.member.voiceChannel;

        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.playSearch("scsearch: " + query);
        } catch {
            return reply.warn("Não foram encontradas aixas.");
        }

        return reply(formatMessage(trackData, message.author));
    }

    help = "Pesquisa a SoundCloud por músicas.";
    arg = {
        type: "string",
        typeText: "query",
        info: "O termo de pesquisa.",
        example: "Hight Hopes.",
        max: 200
    }
}

class LinkCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, query] = message.args;

        const vc = message.member.voiceChannel;

        const player = await bot.player.get(vc);
        if (!player._broadcastChannel) player.setBroadcast(message.channel);
        if (!player.dj) player.setDJ(message.author.id);

        try {
            var trackData = await player.playLink(query);
        } catch {
            return reply.warn("Não foram encontradas faixas.");
        }

        return reply(formatMessage(trackData, message.author));
    }

    help = "Põe um link a tocar..";
    arg = {
        type: "string",
        typeText: "link",
        info: "O link para tocar.",
        example: "https://www.youtube.com/watch?v=xNu4oHPULQQ",
        max: 1000
    }
}

function formatMessage(trackData, author) {
    const type = typeof2(trackData) === "array";
    const main = type ? trackData[0] : trackData;
    let txt = `**Queued song: [${main.title}](${main.url})**`
    if (type) txt += ` **plus ${trackData.length - 1} more**`;
    return author.client.embed
        .setAuthor(author.username, author.avatarURL())
        .setDescription(txt)
        .nitroColor()
}

module.exports = PlayCommand;

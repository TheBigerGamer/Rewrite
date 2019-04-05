const { Command, TIME } = require("../../Nitro");

class AdminPollCommand extends Command {

    async run({ message, bot, reply, t }) {
        if (message.guild.cache.exists("apoll")) return reply("**Já há uma votação a decorrer.**");
        const [display, voting, time, opts] = message.args;

        if (!display.hasSendPerms) return reply(`**Preciso de permissões para mandar mensagens em ${display}.**`);
        if (!voting.hasSendPerms) return reply(`**Preciso de permissões para mandar mensagens em ${voting}.**`);

        let split = opts.split("|");
        if (!split[0]) return reply("**Separa as tas opções com `|`**");
        if (split.length <= 2) return reply("**Tens de ter pelo menos duas opções.**");
        let quest = split[0];
        split = split.slice(1).map(t => t.trim());
        let options = split.map(t => ({ content: t, votes: 0 }));

        let poll = {
            author: message.author.id,
            total: 0,
            options,
            quest
        }

        message.guild.cache.set("apoll");
        message.author.cache.deleteAll("apoll");
        reply(`**Responde com \`endpoll\` em ${voting} para terminar a votação mais rápido.**`)
        display.send(`**__${quest}__**

${split.map((t, i) => `**${i+1}. ${t}**`).join("\n")}

Pode votar com \`${message.prefix}vote <option number>\` em ${voting}`);

        let collector = voting.createMessageCollector(m => m.author.bot !== true, {
            time: time.milliseconds()
        });
        collector.on("collect", msg => {
            if (msg.content === "endpoll") {
                if (msg.author.id === message.author.id ||
                    msg.channel.permissionsFor(msg.author).has("MANAGE_GUILD"))
                    collector.stop("endpoll");
            }
            if (!msg.content.startsWith(message.prefix + "vote")) return;
            if (msg.author.cache.exists("apoll")) 
                return msg.channel.send("**Já votaste**").then(m => m.delete(14000))
            let num = parseInt(msg.content.split(/\s+/g)[1]) || "invalid";
            if (num === "invalid" || num <= 0 || num > poll.options.length)
                return msg.channel.send("**Número de opção inválido**");
            msg.delete();
            poll.options[num - 1].votes++;
            poll.total++;
            msg.channel.send("**Voto coletado**").then(m => m.delete(14000));
            msg.author.cache.set("apoll");
        })

        collector.on("end", () => {
            message.guild.cache.delete("apoll");
            if (poll.total === 0) return display.send("**Resultado da votação:**\nNinguém votou");
            let top = poll.options.sort((a, b) => {
                return b.votes - a.votes;
            })
            let star = [];
            let under = top.slice(0);
            let topValue = top[0].votes;
            top.forEach(t => {
                if (t.votes === topValue) star.push(t), under = under.slice(1);
            })
            let txt = `**Resultados da votação:**
Votos totais: ${poll.total}

**__${poll.quest}__**

${star.map(t => `:star: **${t.content}:** \`${t.votes}\` :star:`).join("\n")}

${under.map(t => `**${t.content}: ** \`${t.votes}\``).join("\n")}`;
            display.send(txt);
        })
    }

    help = "Cria uma votação com um canal de display e votação separados.";
    userPerm = "MANAGE_GUILD";
    alias = "apoll";
    args = [{
        type: "channel",
        info: "O canal de display da votação.",
        example: "#avisos"
    }, {
        type: "channel",
        info: "O canal de votação para a votação.",
        example: "#spam"
    }, {
        type: "duration",
        info: "A duração da votação.",
        example: "3h30m",
        max: TIME.day,
        min: TIME.minute * 5
    }, {
        type: "string",
        info: "A questão e as opções separadas por `|`",
        example: "Quem é o melhor? | Michael Jackson | Freddy Mercury | Madona"
    }]
}

module.exports = AdminPollCommand;

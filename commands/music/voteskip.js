const { Command } = require("../../Nitro");

class VoteSkipCommand extends Command {

    async run({ message, bot, reply, t }) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para executares este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há música a tocar.")

        if (message.guild.cache.exists("voteskip")) return;
        message.guild.cache.set("voteskip");

        const botVC = message.guild.me.voiceChannel;
        if (!botVC) return reply("O bot não está no canal de voz.");
        const listenting = botVC.members.size;
        if (listenting <= 2) {
            player.skip();
            return reply.succ("Música saltada.");
        }

        if (message.guild.cache.exists("voteskip")) return;
        message.guild.cache.set("voteskip");

        const needed = Math.ceil(listenting / 2);
        const voted = [message.author.id];
        const filter = m => m.content === `${message.prefix}voteskip` && !voted.includes(m.author.id);
        const collector = message.channel.createMessageCollector(filter, { time: 30000 });
        collector.on("collect", m => {
            voted.push(m.author.id);
            const botVC = message.guild.me.voiceChannel;
            if (!botVC) collector.stop();
            const listenting = botVC.members.size;
            const needed = Math.ceil(listenting / 2);
            if (voted.length >= needed) {
                collector.stop();
                player.skip();
                m.channel.send("**Música saltada**");
            } else m.channel.send(`**${voted.length}/${needed} votos necessários para saltar esta música.**`)
        })

        collector.on("end", r => {
            if (r === "time")
                message.channel.send("**Avanço por votação falhou.**")
        })
    }

    help = "Vota para saltar a música atual.";
}

module.exports = VoteSkipCommand;

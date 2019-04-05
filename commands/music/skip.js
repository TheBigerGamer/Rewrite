const { Command } = require("../../Nitro");

class SkipMusicCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para executares este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há musica a tocar.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("Precisas de ser DJ para executares este comando.");

        player.skip();
        return reply.succ("Musica saltada.");
    }

    help = "Salta a música atual.";
}

module.exports = SkipMusicCommand;

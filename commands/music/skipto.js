const { Command } = require("../../Nitro");

class SkipToMusicCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [num] = message.args;

        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para executares este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há musica a tocar.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("Precisas de ser DJ para executares este comando.");

        player.skipto(num);
        return reply.succ("Músicas saltadas.");
    }

    help = "Salta x músicas.";
    arg = {
        type: "num",
        info: "O número de músicas para saltar.",
        example: "5",
        min: 1,
        max: 100
    }
}

module.exports = SkipToMusicCommand;

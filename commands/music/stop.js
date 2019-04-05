const { Command } = require("../../Nitro");

class StopMusicCommand extends Command {
    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para executares este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há música a tocar.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("Precisas de ser DJ para executar este comando.");

        player.kill();
        return reply.succ("Música parada.");
    }

    help = "Para a reprodução de música.";
}

module.exports = StopMusicCommand;

const { Command } = require("../../Nitro");

class ResumeCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para executares este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há musica a tocar.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("Precisas de permissões de host para usares este comando.");

        player.unpause();
        return reply.succ("Música a tocar novamente.");
    }

    help = "Põe a tocar a musica pausada.";
}

module.exports = ResumeCommand;

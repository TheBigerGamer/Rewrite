const { Command } = require("../../Nitro");

class PauseCommand extends Command {

    async run({ message, bot, reply, t }) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para ouvir música.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não está música a tocar.")

        if (!player.isDJ(message.author.id, message.channel))
            return reply.warn("Precisas de permissão de host para executar este comando.");

        player.pause();
        return reply.succ("Música pausada.");
    }

    help = "Pausa a música.";
}

module.exports = PauseCommand;

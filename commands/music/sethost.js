const { Command } = require("../../Nitro");

class SetHostCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz paras executares este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há musica a tocar.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("Precisas de permissões de host para executares este comando.");

        const [user] = message.args;
        player.setDJ(user.id);
        return reply.succ(`${user.tag} foi feito host.`);
    }

    help = "Define o host da sessão atual.";
    arg = {
        type: "user",
        info: "O utilizador para ser o host.",
        example: "@otheruser"
    }
}

module.exports = SetHostCommand;

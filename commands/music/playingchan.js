const { Command } = require("../../Nitro");

class PlayingChannelCommand extends Command {

    async run ({message, bot, reply, t}) {
        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para ouvires música.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há música a tocar.")

        if (!player.isDJ(message.author.id, message.channel)) 
            return reply.warn("Precisas de permissões de host para executar este comando.");

        const [chan] = message.args;
        player.setBroadcast(chan.id);
        return reply.succ("Canal **Agora no ar** definido para " + chan);
    }

    help = "Define o canal onde as mensagens de **Agora no ar** são enviadas.";
    alias = "playingchannel"
    arg = {
        type: "channel",
        info: "O canal para as mensagens.",
        example: "#music",
        default: true
    }
}

module.exports = PlayingChannelCommand;

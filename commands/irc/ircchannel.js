const { Command } = require("../../Nitro");

class IRCChannelCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [channel] = message.args;
        const irc = await channel.irc();

        if (irc) {
            await channel.irc(false);
            return await reply.succ("Desativado IRC em: ", channel.toString());
        } else {
            await channel.irc(true);
            return await reply.succ("Ativado IRC em: ", channel.toString());
        }
    }

    help = "Altera se um canal está aberto a IRC.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "channel",
        info: "Um canal para incluir mensagens IRC.",
        example: "#irc",
        default: true
    };
}

module.exports = IRCChannelCommand;

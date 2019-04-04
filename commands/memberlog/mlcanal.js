const { Command } = require("../../Nitro");

class MLChannelCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [channel] = message.args;
        const mlchannel = await message.guild.mlchan();

        if (mlchannel) {
            await message.guild.mlchan(false);
            return await reply.succ("Desativados todos os logs de membros.")
        } else {
            const perms = channel.permissionsFor(bot.user);
            if (channel.type !== "text" ||
                !perms.has("SEND_MESSAGES") ||
                !perms.has("EMBED_LINKS") ||
                !perms.has("ATTACH_FILES"))
                return await reply.fail("Falta a permissão de canal: ", "Enviar mensagens, Links de Embed, Adicionar ficheiros");

            await message.guild.mlchan(channel.id);
            return await reply.succ("Os logs de membros serão mostrados em: ", channel.toString());
        }
    }

    help = "Define o canal onde os logs de membros serão mostrados.";
    userPerms = ["MANAGE_GUILD"];
    alias = ["memberlogchannel", "mlchan"];
    arg = {
        type: "channel",
        info: "O canal onde os logs de membros são enviados.",
        example: "#memberlog",
        default: true
    };
}

module.exports = MLChannelCommand;

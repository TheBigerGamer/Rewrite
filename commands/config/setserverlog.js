const { Command } = require("../../Nitro");

class SetServerLogCommand extends Command {

    async run({ message, bot, reply, t }) {
        const modlog = await message.guild.serverlog();
        if (modlog) {
            await message.guild.serverlog(false);
            return await reply.succ("Server Log desativado ");
        }

        const [channel] = message.args;
        const perms = channel.permissionsFor(bot.user);
        if (!perms.has("SEND_MESSAGES") || !perms.has("EMBED_LINKS"))
            return await reply.warn("Preciso de permissão para enviar embeds em " + channel.toString());

        await message.guild.serverlog(channel.id);
        return await reply.succ("Server log defenido para " + channel.toString());
    }

    help = "Define o canal onde o Server Log é registado.";
    userPerms = ["MANAGE_GUILD"];
    arg = {
        type: "channel",
        info: "O canal para enviar logs",
        example: "#serverlog",
        default: true
    };
}

module.exports = SetServerLogCommand;

const { Command } = require("../../Nitro");

class ModHistoryCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;
        const userData = await message.guild.userData();
        const data = userData[user.id] || {};
        const mem = data.mod;
        if (!mem) return reply.fail("Não há nada no histórico deste utilizador.");
        const embed = bot.embed
            .setTitle("Histórico do Mod")
            .setAuthor(user.tag, user.avatarURL())
            .nitroColor();
        for (let [action, am] of Object.entries(mem)) {
            embed.addBetterField(action, am);
        }

        reply(embed);
    }

    help = "As ações do moderador.";
    alias = "modh";
    arg = {
        type: "user",
        info: "O moderador para obter as suas ações.",
        example: "@modboi",
        default: true
    }
}

module.exports = ModHistoryCommand;

const { Command } = require("../../Nitro");

class UserHistoryCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user, action] = message.args;
        const userData = await message.guild.userData();
        const data = userData[user.id] || {};
        const mem = data.mem;
        if (!mem) return reply.fail("Não há histórico para esse utilizador.");

        const embed = bot.embed
            .setTitle("Histórico do Utilizador")
            .setAuthor(user.tag, user.avatarURL())
            .nitroColor();

        if (action === "all") {
            for (let [action, reasons] of Object.entries(mem)) {
                embed.addBetterField(action + "s", reasons.length);
            }
        } else {
            const reasons = mem[action];
            if (!reasons) return reply.fail(`Este utilizador não tem ${action}s`);
            embed.setTitle("Histórico do Utilzador - " + action + "s");
            let txt = [];
            for (let i = 0; i < reasons.length; i++) {
                txt.push(`**${i+1}.** "${reasons[i]}"`);
            }
            embed.setDescription(txt.join("\n").shorten(1900, "..."));
        }

        reply(embed);
    }

    help = "Ações de moderação num utilizador.";
    alias = "userh";
    args = [{
        type: "user",
        info: "O utilizador para serem atuadas as ações de moderação.",
        example: "@goodboi",
        default: true
    }, {
        type: "selection",
        info: "Especifica ação: `ban`, `softban`, `tempban`, `kick`, `mute`, `warn`, ou `unban`",
        example: "kick",
        items: ["ban", "softban", "tempban", "kick", "mute", "warn", "unban", "all"],
        default: "all"
    }]
}

module.exports = UserHistoryCommand;

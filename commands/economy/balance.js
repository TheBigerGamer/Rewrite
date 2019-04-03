const { Command } = require("../../Nitro");
const Wallet = require("../../Classes/Wallet")

class BalanceCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [user] = message.args;
        const bal = await user.wallet.balance();

        const embed = bot.embed
            .setTitle(":atm: " + user.tag + " :atm:")
            .nitroColor()
        embed.setDescription("\u200B                 **" + message.guild.formatBal(bal) + "**");
        return await reply(embed);
    }

    help = "Mostra o teu saldo bancário";
    alias = ["money", "bal"];
    arg = {
        type: "user",
        info: "O utilizador para ser mostrado o saldo.",
        example: "@richboi",
        default: true
    }
}

module.exports = BalanceCommand;

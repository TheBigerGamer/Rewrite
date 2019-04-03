const { Command } = require("../../Nitro");

class GiftCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [user, am] = message.args;
        if (user.id === message.author.id) return reply.fail("Não podes dar dinheiro a ti mesmo.");
        if (user.bot) return reply.fail("Os BOTs não precisam de dinheiro.");
        if (!await message.author.wallet.hasEnough(am)) return reply.fail("Tás pobre demais para isso, pá.");
        await message.author.wallet.sub(am);
        await user.wallet.add(am);
        const give = message.guild.formatBal(am);
        return reply(`**Gave ${give} to ${user.tag}**`);
    }

    help = "Presenteia outro utilizador com dinheiro.";
    cooldown = 10;
    args = [{
        type: "user",
        info: "O utilizador para dar dinheiro",
        example: "@user"
    }, {
        type: "int",
        info: "A quantidade para dar",
        example: "100"
    }]
}

module.exports = GiftCommand;

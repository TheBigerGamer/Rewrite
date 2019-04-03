const { Command } = require("../../Nitro");

class PrefixCommand extends Command {

    async run({ message, bot, send, t }) {
        if (!message.checkSuffix) return send("**Usa o comando prefix para alterar o(s) caracteres no inicio dos comandos\nSe quiseres espaços no prefixo, lembra-te de o meter entre aspas.**");
        if (message.suffix.replace(/[^\"]/g, "").length === 2) {
            let split = message.suffix.split("\"")
            let quote = split[1];
            if (quote.length < 1) return send("` ` não é um prefixo válido.");
            if (quote.startsWith(" ")) return send("`" + pre + "` não é um prefixo válido.");
            if (quote.length > 20) return send("EH DIABO! Isso é que é um ganda prefixo. Acho que ninguém o conseguiria decorar. Mete um mais pequeno, tá bem?");
            await message.guild.prefix(quote);
            return send("**O prefixo foi defenido para `" + quote + "`\nTest - `" + quote + "ping`**");
        } else {
            let pre = message.suffix.trim();
            await message.guild.prefix(pre);
            return send("**O prefixo foi defenido para `" + pre + "`\nTest - `" + pre + "ping`**");
        }
    }

    help = "Muda o prefixo para comandos.";
    usage = '`{}prefix !!` - O comando ping será utilizado como `!!ping`\n`{}prefix "warlock "` - Este prefixo tem um espaço, mas continua a ser utilizável `warlock ping`';
    userPerm = "MANAGE_GUILD";
    cooldown = 20;
    alias = ["setprefix"];

}

module.exports = PrefixCommand;

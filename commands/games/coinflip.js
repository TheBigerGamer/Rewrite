const { Command } = require("../../Nitro");

class FlipCommand extends Command {

    async run ({message, bot, reply, t}) {
        if (Math.round(Math.random())) {
            reply("**Cara! Toma, guarda-a**");
            message.author.wallet.add(1);
        } else {
            reply("**Coroa. Fico com a moeda.**");
            message.author.wallet.sub(1);
        }
    }

    help = "Atira uma moeda ao ar";
}

module.exports = FlipCommand;

const { Command } = require("../../Nitro");
const cows = require('cows')();

class CowCommand extends Command {
    async run ({message, bot, reply, t}) {
        const cow = cows[Math.floor(Math.random() * cows.length - 1)];
        reply("```\n" + cow + "```");
    }

    help = "Vaca em Ascii aleatória";
}

module.exports = CowCommand;

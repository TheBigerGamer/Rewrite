const { Command } = require("../../Nitro");

class LevelingCommand extends Command {

    async run ({message, bot, reply, t}) {
        send("test")
    }

    help = "Ativa o sistema de níveis no teu servidor.";
    wip = true;
}

module.exports = LevelingCommand;

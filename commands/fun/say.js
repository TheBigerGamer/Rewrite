const { Command } = require("../../Nitro");

class SayCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        reply(input);
    }

    help = "Faz o Warlock dizer algo";
    userPerm = "MANAGE_MESSAGES";
    alias = ["echo"];
    arg = {
        type: "string",
        info: "O uqe é que queres que o Warlock diga?",
        example: "**ECHO**... **echo**... echo...",
    }
}

module.exports = SayCommand;

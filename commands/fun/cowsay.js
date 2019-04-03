const { Command } = require("../../Nitro");

class CowsayCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [input] = message.args;
        const cow = "        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n"
        reply("`\n." + '_'.repeat(input.length + 2) + "\n< " + input + " >\n " + '-'.repeat(input.length + 2) + "\n" + cow + "`");
    }

    help = "A vaca diz";
    arg = {
        type: "string",
        info: "O que queres que a vaca diga?",
        example: "Meow!",
    }
}

module.exports = CowsayCommand;

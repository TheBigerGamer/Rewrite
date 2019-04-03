const { Command } = require("../../Nitro");

class UnflipCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply("(╯°□°)╯  ︵  ┻━┻");
        await promiseTimeout(500);
        await reply.edit("(╯°□°)╯    ]");
        await promiseTimeout(500);
        await reply.edit("(°-°)\\ ┬─┬");
    }

    help = "Regresso no tempo para a mesa que atiraste";
}

module.exports = UnflipCommand;

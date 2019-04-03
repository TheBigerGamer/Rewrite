const { Command } = require("../../Nitro");

class TableFlipCommand extends Command {

    async run({ message, bot, send, t }) {
        const msg = await send("(°-°)\\ ┬─┬");
        await timeout(500);
        await msg.edit("(╯°□°)╯    ]");
        await timeout(500);
        await msg.edit("(╯°□°)╯  ︵  ┻━┻");
    }

    help = "Table Flip Animado";
    cooldown = 3;
}

module.exports = TableFlipCommand;

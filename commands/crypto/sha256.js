const { Command } = require("../../Nitro");
const { createHash } = require("crypto");

class ShaCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [ text ] = message.args;
        const s = createHash("sha256").update(text).digest("hex");
        reply(`${text} - ` + s);
    }

    help = "Obtem o shasum de uma frase.";
    arg = {
        type: "string",
        info: "Texto para encriptar.",
        example: "foobarbaz",
        max: 1000
    }
}

module.exports = ShaCommand;

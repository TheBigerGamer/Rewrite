const { Command } = require("../../Nitro");
const snekfetch = require("snekfetch");

const url = "http://api.adviceslip.com/advice";

class AdviceCommand extends Command {

    async run ({message, bot, reply, t}) {
        const r = await snekfetch.get(url);
        const { advice } = JSON.parse(r.body).slip;
        reply(`**:speech_balloon: ${advice}**`);
    }

    async error({reply}) {
        return await reply.warn("A máquina de conselhos :regional_indicator_q:ebrou");
    }

    help = "Conselho para a alma.";
    cooldown = 5;
}

module.exports = AdviceCommand;

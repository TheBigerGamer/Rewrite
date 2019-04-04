const { Command, util: { cap, round } } = require("../../Nitro");

class MLMessageCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [ when, type, msg ] = message.args;

        if (type === "desativar") {
            await message.guild[`ml${when}`](false);
            return await reply.succ("Desativadas `" + when +"` mensagens.");
        }

        if (type === "text" && !msg) return await reply.fail("Escrever texto necessita de uma mensagem.");

        await message.guild[`ml${when}`]({ type, msg });
        return await reply.succ(when + " definida mensagem.");
    }

    help = "Define o log de membros para entrar ou sair e a mensagem";
    alias = "mlmsg";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "selection",
        items: ["join", "leave"],
        info: "Para as mensagens de `entrar` ou `sair`.",
        example: "join"
    }, {
        type: "selection",
        items: ["text", "embed", "image", "disable"],
        info: "O tipo de mensagem para enviar. `text`, `embed`, `image`, ou `desativar` para desligar.",
        example: "embed"
    }, {
        type: "string",
        info: "O texto da mensagem.",
        example: "Bem-vindo {name} ao HQ.",
        default: null
    }];
}

module.exports = MLMessageCommand;

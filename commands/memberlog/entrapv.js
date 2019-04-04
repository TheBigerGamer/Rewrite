const { Command } = require("../../Nitro");

class JoinDMCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [m] = message.args;
        if (m === "desativar") {
            await message.guild.mldm();
            return reply.succ("EntraPV desativado.")
        }
        await message.guild.mldm(m);
        return reply.succ(`Users will be sent \`${m}\``);
    }

    help = "Envia uma mensagem quando o utilizador entra.";
    arg = {
        type: "string",
        info: "A mensagem para enviar ou `desativar`",
        example: "Bem-vindo."
    }
}

module.exports = JoinDMCommand;

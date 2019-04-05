const { Command } = require("../../Nitro");

class RoleMeCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const roles = await message.guild.rolemeroles();
        if (!roles.includes(role.id)) return reply.fail(`\`${role.name}\` não é atribuível.`);
        if (!message.member.roles.has(role.id)) {
            try {
                await message.member.roles.add(role);
                return reply.succ(`Atribuído \`${role.name}\``);
            } catch {
                return reply.fail(`Não tenho permissões para atribuír \`${role.name}\`.`);
            }
        } else {
            try {
                await message.member.roles.remove(role);
                return reply.succ(`Removido \`${role.name}\``);
            } catch {
                return reply.fail(`Não tenho permissões para remover \`${role.name}\``);
            }
        }
    }

    help = "Atribui um cargo a ti mesmo.";
    alias = "iam";
    arg = {
        type: "role",
        info: "O cargo para atribuir.",
        example: "Membro"
    }
}

module.exports = RoleMeCommand;

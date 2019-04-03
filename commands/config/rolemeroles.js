const { Command } = require("../../Nitro");

class RoleMeRolesCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const roles = await message.guild.rolemeroles();
        let i = roles.indexOf(role.id)
        if (~i) {
            roles.splice(i);
            reply.succ(`Removido \`${role.name}\` do roleme.`)
        } else {
            roles.push(role.id);
            reply.succ(`Adicionado \`${role.name}\` ao roleme.`)
        }
        return message.guild.rolemeroles(roles);
    }

    help = "Edita os cargos no roleme.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "role",
        info: "Altera para remover ou adicionar",
        example: "User"
    };
}

module.exports = RoleMeRolesCommand;

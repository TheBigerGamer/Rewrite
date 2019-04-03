const { Command } = require("../../Nitro");

class AutoRoleCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [role] = message.args;

        const autorole = await message.guild.ar();
        if (autorole || !role) {
            await message.guild.ar(false);
            return await reply.succ("Autocargo desativado.");
        } else {
            const botMember = message.guild.member(
                bot.user);
            if (botMember.roles.highest.position <= role.position)
                return await reply.fail("Este cargo é maior do que o meu. Nõ o consigo dar a outros usuários.");

            await message.guild.ar(role.id);
            return await reply.succ("Autocargo defenido para: ", role.name);
        }
    }

    help = "Setup a role for when users join.";
    userPerm = "MANAGE_GUILD";
    botPerm = "MANAGE_ROLES";
    alias = "ar";
    arg = {
        type: "role",
        info: "O cargo para dar automáticamente para usuários.",
        example: "@member",
        default: null
    }
}

module.exports = AutoRoleCommand;

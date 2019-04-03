const { Command, FUNNBOT } = require("../../Nitro");

class BlacklistCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            user: BlackListUserCommand,
            channel: BlackListChannelCommand,
            role: BlackListRoleCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        await this.runSubCommand(sub);
    }

    help = "Blacklist para a utilização do bot";
    userPerm = "MANAGE_GUILD";
    alias = ["unblacklist", "whitelist"];
    arg = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    }
}

class BlackListUserCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [mem] = message.args;

        if (mem.user.id === FUNNBOT ||
            mem.roles.highest.position >=
            message.member.roles.highest.position)
            return await reply.warn("You cannot blacklist this user.");

        const bl = await message.guild.blacklist();
        if (bl[mem.user.id]) {
            delete bl[mem.user.id];
            await message.guild.blacklist(bl);
            return await reply.succ("Usuário retirado da Blacklist: ", mem.user.username);
        } else {
            bl[mem.user.id] = 1;
            await message.guild.blacklist(bl);
            return await reply.succ("Usuário colocado na Blacklist: ", mem.user.username);
        }
    }

    help = "Coloca um usuário na Blacklist.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "member",
        info: "O usuário para a Blacklist",
        example: "@badboi",
    }
}

class BlackListChannelCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [chan] = message.args;

        const bl = await message.guild.blacklist();
        if (bl[chan.id]) {
            delete bl[chan.id];
            await message.guild.blacklist(bl);
            return reply.succ("Canal removido da Blacklist: ", chan.toString());
        } else {
            bl[chan.id] = 1;
            await message.guild.blacklist(bl);
            return await reply.succ("Canal adicionado à Blacklist: ", chan.toString());
        }
    }

    help = "Adiciona à Blacklist todos os comandos num canal.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "channel",
        info: "O canal para a blacklist",
        example: "#nocommands",
    }
}

class BlackListRoleCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [role] = message.args;
        const mem = message.member;

        if (roles.position >= mem.roles.highest.position)
            return reply.warn("Não podes colocar este cargo na Blacklist.");

        const bl = await message.guild.blacklist();
        if (bl[role.id]) {
            delete bl[role.id];
            await message.guild.blacklist(bl);
            return reply.succ("Cargo adicionado à Blacklist: ", role.name);
        } else {
            bl[role.id] = 1;
            await message.guild.blacklist(bl);
            return reply.succ("Cargo removido da Blacklist: ", role.name);
        }
    }

    help = "Adiciona à Blacklist todos os comandos de um cargo.";
    userPerm = "MANAGE_GUILD";
    arg = {
        type: "role",
        info: "O cargo para adiciona à Blacklist",
        example: "@users",
    }
}

module.exports = BlackListUserCommand;

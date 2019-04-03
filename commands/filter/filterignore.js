const { Command } = require("../../Nitro");

class ExemptCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            channel: ExemptChannelCommand,
            user: ExemptUserCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        await this.runSubCommand(sub);
    }

    help = "Insentar um filtro.";
    userPerm = "MANAGE_GUILD";
    alias = "unexempt";
    args = {
        type: "selection",
        typeText: "subcommand",
        example: "user",
        endWithoutRest: true
    };
}

class ExemptChannelCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, filt, channel] = message.args;

        const filters = await message.guild.filters();
        if (!filters[name]) return reply.warn(`Filtro ${filt} não existe`);
        const filter = filters[name];
        const exempt = filter.exempt;

        if (exempt[channel.id]) {
            delete exempt[channel.id];
            reply.succ(`O filtro ${filt} não vai ser mais ignorar: `, channel.toString());
        } else {
            exempt[channel.id] = 1;
            reply.succ(`O filtro ${filt} vai ignorar: `, channel.toString());
        }

        filter.exempt = exempt;
        filters[name] = filter;
        return await message.guild.filters(filters);
    }

    help = "Faz filtros ignorarem um canal.";
    args = [{
        type: "string",
        info: "O filtro para adicionar a ignorância.",
        example: "badwords"
    }, {
        type: "channel",
        info: "O canal para ser ignorado pelo filtro.",
        example: "#anuncios",
        default: true
    }];
}

class ExemptUserCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, filt, user] = message.args;

        const filters = await message.guild.filters();
        if (!filters[name]) return reply.warn(`Filtro ${filt} não existe`);
        const filter = filters[name];
        const exempt = filter.exempt;

        if (exempt[user.id]) {
            delete exempt[user.id];
            reply.succ(`O filtro ${filt} não vai mais ignorar: `, user.username);
        } else {
            exempt[user.id] = 1;
            reply.succ(`O filtro ${filt} vai ignorar: `, user.username);
        }

        filter.exempt = exempt;
        filters[name] = filter;
        return await message.guild.filters(filters);
    }

    help = "Faz o filtro ignorar um utilizador.";
    args = [{
        type: "string",
        info: "O filtro para adicionar a ignorância.",
        example: "badwords"
    }, {
        type: "user",
        info: "O utilizador para ser ignorado.",
        example: "@user",
        default: true
    }];
}

class ExemptRoleCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, filt, role] = message.args;

        const filters = await message.guild.filters();
        if (!filters[name]) return reply.warn(`O filtro ${filt} não existe`);
        const filter = filters[name];
        const exempt = filter.exempt;

        if (exempt[role.id]) {
            delete exempt[role.id];
            reply.succ(`O filtro ${filt} não vai mais ignorar: `, role.name);
        } else {
            exempt[role.id] = 1;
            reply.succ(`O filtro ${filt} vai ignorar: `, role.name);
        }

        filter.exempt = exempt;
        filters[name] = filter;
        return await message.guild.filters(filters);
    }

    help = "Faz um filtro ignorar um canal.";
    args = [{
        type: "string",
        info: "O filtro para ser adicionada a ignorância.",
        example: "badwords"
    }, {
        type: "user",
        info: "O utilizador para ser ignorado pelo filtro.",
        example: "@user",
        default: true
    }];
}

module.exports = ExemptChannelCommand;

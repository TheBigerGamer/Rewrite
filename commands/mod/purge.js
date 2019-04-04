const { Command, TIME } = require("../../Nitro");

class PurgeCommand extends Command {
    onEnable() {
        this.registerSubCommands({
            count: PurgeCountSubCommand,
            match: PurgeMatchSubCommand,
            user: PurgeUserSubCommand,
            id: PurgeIdSubCommand,
            channel: PurgeChannelSubCommand,
            images: PurgeImagesSubCommand,
            embeds: PurgeEmbedsSubCommand,
            small: PurgeSmallSubCommand,
            large: PurgeLargeSubCommand,
            newusers: PurgeNewUsersSubCommand
            // role: PurgeRoleSubCommand
        })
    }

    async run({ message, bot, reply, t }) {
        const [sub] = message.args;
        await this.runSubCommand(sub);
    }

    help = "Purga mensagens.";
    userPerm = "MANAGE_MESSAGES";
    botPerm = "MANAGE_MESSAGES";
    arg = {
        type: "selection",
        typeText: "subcommand",
        /*items: [],
        info: "",*/
        example: "count",
        endWithoutRest: true
    }
}

const IntArg = {
    type: "int",
    info: "O número de mensagens a recolher.",
    example: "100",
    min: 3,
    max: 100,
    default: 100
}

class PurgeNewUsersSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, minDays, num] = message.args;

        const now = Date.now();
        const filter = m => now - m.author.createdTimestamp < TIME.day * minDays;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens enviadas por utilizadores há menos tempo que dias.";
    args = [{
        type: "int",
        info: "Numero de dias para ser um novo utilizador.",
        example: "1",
        min: 1,
        max: 7,
    }, IntArg]
}

class PurgeSmallSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, length, num] = message.args;

        const filter = m => m.content.length <= length;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens menores que um certo comprimento.";
    args = [{
        type: "int",
        info: "O máximo comprimento de uma mensagem para ser purgada",
        example: "5",
        min: 1,
        max: 500,
    }, IntArg];
}

class PurgeLargeSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, length, num] = message.args;

        const filter = m => m.content.length >= length;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens maiores que um certo comprimento.";
    args = [{
        type: "int",
        info: "O comprimento minimo para uma mensagem ser purgada",
        example: "1000",
        min: 500,
        max: 2000,
    }, IntArg];
}

class PurgeEmbedsSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, num] = message.args;

        const filter = m => m.embeds.length > 0;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens que têm um embed linkado"
    arg = IntArg;
}

class PurgeImagesSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, num] = message.args;

        const filter = m => m.attachments.size > 0;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens que têm um anexo.";
    arg = IntArg;
}

class PurgeChannelSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, channel] = message.args;

        await reply("**Tens a certeza de que queres purgar as mensagens deste canal " + channel.toString() + ", isto vai dar ao canal um novo id, convites conectados a este canal vão ser removidos, e não é reversivél.** `sim/não`");
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await reply.edit("**Cancelado.**");

        const clone = await channel.clone({ reason: "canal purgado" });
        await channel.delete("channel purge");

        clone.send("**Canal purgado.**");
    }

    help = "Clona e elimina um canal para eliminar todas as suas mensagens.";
    userPerm = "MANAGE_CHANNELS";
    botPerm = "MANAGE_CHANNELS";
    arg = {
        type: "channel",
        info: "O canal para ser purgado.",
        example: "#spam-channel",
        default: true
    }
}

class PurgeIdSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, id, num] = message.args;

        const filter = m => m.author.id === id;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens enviadas por um utilizador pelo seu id";
    args = [{
        type: "id",
        info: "O id do utilizador para purgar.",
        example: "359083453020635137"
    }, IntArg]
}

class PurgeUserSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, user, num] = message.args;

        const filter = m => m.author.id === user.id;
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens enviadas por um utilizador.";
    args = [{
        type: "user",
        info: "O utilizador para ser purgado.",
        example: "@baduser"
    }, IntArg]
}

class PurgeMatchSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, match, num] = message.args;

        const filter = m => m.content.toLowerCase().includes(match.toLowerCase());
        return await purgeMessages(message.channel, filter, num);
    }

    help = "Purga mensagens que coincidam com uma frase."
    args = [{
        type: "string",
        info: "A frase para coincidir.",
        example: "badword"
    }, IntArg]
}

class PurgeCountSubCommand extends Command {
    async run({ message, bot, reply, t }) {
        const [_, num] = message.args;

        await message.channel.bulkDelete(num, true);
        await reply(`**Purgadas ${num} mensagens.**`);
    }

    help = "Purga um número de mensagens.";
    arg = IntArg;
}

async function purgeMessages(channel, filter, amount) {
    const msgs = await channel.messages.fetch({ limit: 100 });
    const sorted = msgs.sort((a, b) => b.createdTimestamp - a.createdTimestamp)
    const filtered = sorted.filter(filter);
    const limited = filtered.array().slice(0, amount);
    await channel.bulkDelete(limited, true);
    return await channel.send(`**Purgadas ${limited.length} mensagens.**`);
}

module.exports = PurgeCommand;

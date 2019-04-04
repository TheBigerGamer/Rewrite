const { Command } = require("../../Nitro");

class UnbanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [search, reason] = message.args;

        const bans = await message.guild.fetchBans();
        const [user, err] = findMember(search, bans);
        if (err) return reply.fail(err);

        let txt = `Tens a certeza de que queres desbanir o utilizador ${user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Abortado.**", { embed: null });
        else await m.edit(`**Desbanindo...**`, { embed: null });
        try {
            await message.guild.members.unban(user, reason);
        } catch (e) {
            return await m.edit("**Deban falhou**");
        }
        await message.guild.userAction(user.id, "unban", reason);
        await message.guild.modAction(message.author.id, "unban");
        await m.edit(`**User unbanned (ID: ${user.id})**`);

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "unban",
            user: `${user.tag} (${user.id})`,
            mod: message.author,
            reason
        });
    }

    help = "Desbane um utilizador.";
    userPerm = "BAN_MEMBERS";
    args = [{
        type: "string",
        info: "O utilizador ou o seu id para desbanir.",
        example: "goodboinow"
    }, {
        type: "string",
        info: "A razão para desbanir.",
        example: "É bom agora.",
        default: "unspecified"
    }]
}

function findMember(search, bans) {
    let exactMems = bans.filter(memberFilterExact(search));
    if (exactMems.size > 1) return [false, `${exactMems.size} bans encontrados, por favor especifica.`];
    if (exactMems.size === 1) return [exactMems.first().user, null];

    let mems = bans.filter(memberFilterInexact(search));
    if (mems.size > 1) return [false, `${mems.size} bans encontrados, por favor especifica.`];
    if (mems.size === 1) return [mems.first().user, null];

    return [null, "Não foram encontrados bans com esse nome `" + search + "`"];
}

function memberFilterExact(search) {
    const s = search.toLowerCase();
    return m => s === m.user.id ||
        s === m.user.username.toLowerCase() ||
        s === m.user.tag.toLowerCase();
}

function memberFilterInexact(search) {
    const s = search.toLowerCase();
    return m => m.user.tag.toLowerCase().includes(s) ||
        (m.nickname && m.nickname.toLowerCase().includes(s))
}

module.exports = UnbanCommand;

const { Command } = require("../../Nitro");

class BanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [member, reason] = message.args;
        if (!member.bannable) return await reply.fail("Não tenho permissões para banir este utilizador.");
        if (message.member.roles.highest.position <= member.roles.highest.position) return await reply.fail("Não tens permissões para banir este utilizador.");

        let txt = `De certeza que queres banir este utilizador ${member.user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Abortado.**", { embed: null });
        else await m.edit(`**Banindo...**`, { embed: null });
        try {
            await message.guild.members.ban(member, { reason, days: 1 });
        } catch (e) {
            return await m.edit("**Ban falhou**");
        }
        await message.guild.userAction(member.user.id, "ban", reason);
        await message.guild.modAction(message.author.id, "ban");
        await m.edit("**Utilizador banido**");

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "ban",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason
        });
    }

    help = "Ban um membro.";
    alias = ["banne", "b&"];
    botPerms = ["BAN_MEMBERS"];
    userPerms = ["BAN_MEMBERS"];
    args = [{
        type: "member",
        info: "O utilizador para banir.",
        example: "@Badboy"
    }, {
        type: "string",
        info: "A razão do ban.",
        example: "Porque sim",
        default: "unspecified"
    }];
}

module.exports = BanCommand;

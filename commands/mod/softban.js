const { Command } = require("../../Nitro");

class BanCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [member, reason] = message.args;
        if (!member.bannable) return await reply.fail("Não tenho permissões para banir este utilizador.");
        if (message.member.roles.highest.position <= member.roles.highest.position) return await reply.fail("Não tens permissões para softbanar este utilizador.");

        let txt = `Tens a certeza de que queres banir suavemente este utilizador ${member.user.tag}`;
        const m = await message.channel.ask(message.author, txt);
        const failsafe = await message.channel.collectMessage(message.author);
        if (!failsafe) return await m.edit("**Abortado.**", { embed: null });
        else await m.edit(`**Softbanindo...**`, { embed: null });
        try {
            await member.ban({ reason, days: 7 });
            await m.edit("**Desbanindo**")
            await member.unban({ reason: "Softban" });
        } catch (e) {
            return await m.edit("**Softban falhou**");
        }
        await message.guild.userAction(member.user.id, "softban");
        await message.guild.modAction(message.author.id, "softban");
        await m.edit("**Softban completo**");

        const modlogID = await message.guild.modlog();
        const modlog = bot.channels.get(modlogID);
        if (modlog) modlog.createCase({
            action: "softban",
            user: `${member.user.tag} (${member.user.id})`,
            mod: message.author,
            reason
        });
    }

    help = "Bane e unbane um utilizador para eliminar as suas mensagens.";
    alias = ["softbanne", "softb&"];
    botPerms = ["BAN_MEMBERS"];
    userPerms = ["BAN_MEMBERS"];
    args = [{
        type: "member",
        info: "O utilizador para banir suavemente.",
        example: "@Badboy"
    }, {
        type: "string",
        info: "A razão do banimento suave.",
        example: "Alguma coisa.",
        default: "unspecified"
    }];
}

module.exports = BanCommand;

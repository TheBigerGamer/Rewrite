const { Command } = require("../../Nitro");
const moment = require("moment")
class TagInfoCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag não existe");

        try { var owner = await bot.users.get(tag.owner); } catch (e) { var owner = "Unknown"; }
        const created = moment(tag.created).format("llll")
        const edited = moment(tag.edited || 1).format("llll");

        const embed = bot.embed
            .setTitle(tagName)
            .addField("Dono", `${owner.tag} (${owner.id})`)
            .addField("Usada", tag.used)
            .addField("Tag do server", tag.server ? "yes" : "no")
            .addField("Criada", created)
            .nitroColor();
        (!tag.edited) || embed.addField("Editada", edited);

        return await reply(embed);
    }

    help = "Informação de uma tag.";
    usage = "{}taginfo info";
    args = [{
        type: "string",
        info: "O nome de uma tag",
        example: "info"
    }];
}

module.exports = TagInfoCommand;

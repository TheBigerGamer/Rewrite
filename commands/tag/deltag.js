const { Command } = require("../../Nitro");

class DelTagCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        if (!tags[tagName]) return await reply.fail("Tag não existe.");
        let tag = tags[tagName];
        if (tag.owner !== message.author.id || !message.authorPerm("MANAGE_GUILD"))
            return await reply.fail("Não és o dono desta tag.", " A permissão de gerênciar servidor vai ultrapassar isto.");
        delete tags[tagName];
        await message.guild.tags(tags);
        await reply.succ("Tag eliminada.");
    }

    help = "Delete a tag.";
    usage = "{}deltag info";
    alias = ["del-tag", "deletetag", "removetag", "tagdel"];
    args = [{
        type: "string",
        info: "O nome da tag.",
        example: "info"
    }];
}

module.exports = DelTagCommand;

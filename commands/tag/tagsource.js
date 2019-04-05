const { Command, util } = require("../../Nitro");

class TagSourceCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tagName = message.args[0];
        const tags = await message.guild.tags();
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag não existe.");
        let content = "```\n" + util.escapeMarkdown(tag.content) + "```";
        return await reply(content);
    }

    help = "Obtém o markdown de uma tag";
    usage = "{}tag info";
    alias = ["t"];
    arg = {
        type: "string",
        info: "O nome da tag.",
        example: "info"
    };
}

module.exports = TagSourceCommand;

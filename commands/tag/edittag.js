const { Command } = require("../../Nitro");

class EditTagCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tags = await message.guild.tags();
        const tagName = message.args[0];
        const tagContent = message.args[1];
        const tag = tags[tagName];
        if (!tag) return await reply.fail("Tag não existe.");
        tag.content = tagContent;
        tag.edited = Date.now();
        await message.guild.tags(tags);
        return await reply.succ("Tag editada.");
    }

    help = "Edita uma tag";
    usage = "{}edittag info Já não há informação!";
    alias = ["edit-tag", "tagedit"];
    args = [{
        type: "string",
        info: "O nome da tag.",
        example: "info"
    }, {
        type: "string",
        info: "O conteudo da tag.",
        example: "Já não há informação!"
    }];
}

module.exports = EditTagCommand;

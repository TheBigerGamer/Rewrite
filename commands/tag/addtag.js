const { Command } = require("../../Nitro");

class AddTagCommand extends Command {

    async run({ message, bot, reply, t }) {
        const tags = await message.guild.tags();
        const tagName = message.args[0];
        const tagContent = message.args[1];
        if (Object.keys(tags) > 100) return await reply.fail("Demasiadas tags neste server!");
        if (tags[tagName]) return await reply.fail("Tag já existe.");
        if (tagName.length > 100) return await reply.fail("Nome da tag demasiado longo.");
        tags[tagName] = {
            owner: message.author.id,
            content: tagContent,
            created: Date.now(),
            used: 0
        }
        await message.guild.tags(tags);
        return await reply.succ("Tag adicionada");
    }

    help = "Add a tag";
    usage = "{}addtag info Aqui está alguma informação para ti";
    alias = ["add-tag", "newtag", "tagadd"];
    args = [{
        type: "string",
        info: "O nome da tag",
        example: "info"
    }, {
        type: "string",
        info: "O conteudo da tag",
        example: "Aqui está alguma informação para ti!"
    }];
}

module.exports = AddTagCommand;

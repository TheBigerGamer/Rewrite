const { Command } = require("../../Nitro");

class AddServerTagCommand extends Command {

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
            used: 0,
            server: true
        }
        await message.guild.tags(tags);
        return await reply.succ("Added tag");
    }

    help = "Adiciona uma tag ao server.";
    usage = "{}addservertag algo que não interessa a ninguém!";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "string",
        info: "O nome da tag",
        example: "algo"
    }, {
        type: "string",
        info: "O conteudo da tag",
        example: "que não interessa a ninguém!"
    }];
}

module.exports = AddServerTagCommand;

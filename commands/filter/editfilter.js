const { Command } = require("../../Nitro");

class EditFilterCommand extends Command {

    async run({ message, bot, reply, t }) {
        let [name, action, words] = message.args;
        const filters = await message.guild.filters();

        if (!filters[name]) return await reply.warn("Filtro não existe");
        words = words.split(" ").filter(s => s != "").map(s => s.replace(/[^a-z]/gi, ''));
        if (!words.length) return await reply.fail("Nenhuma palavra foi reconhecida.");

        const filter = filters[name];

        for (let word of words) {
            if (action === "add") {
                if (!filter.words.includes(word))
                    filter.words.push(word);
            } else if (action === "del") {
                let i = filter.words.indexOf(word);
                if (i > -1)
                    filter.words.splice(i, 1);
            }
        }

        filters[name] = filter;

        await message.guild.filters(filters);
        return await reply.succ(`Editado filtro ${name}: `, filter.words.join(", "));
    }

    help = "Adiciona ou remove palavras de um filtro.";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "string",
        info: "O nome do filtro",
        example: "badwords",
        max: 100
    }, {
        type: "selection",
        items: ["add", "del"],
        info: "`add` ou `del` uma palavra de um filtro",
        example: "add"
    }, {
        type: "string",
        info: "Palavras para serem adicionadas ou removidas",
        example: "shoot heck",
    }];
}

module.exports = EditFilterCommand;

const { Command } = require("../../Nitro");

class CreateFilterCommand extends Command {

    async run ({message, bot, reply, t}) {
        let [ name, words ] = message.args; 
        const filters = await message.guild.filters();
        name = name.toLowerCase();
        if (!!filters[name]) return await reply.fail(`O filtro \`${name}\` já existe`);
        
        words = words.split(" ").filter(s => s != "").map(s => s.replace(/[^a-z]/gi, '')).map(String.toLowerCase);
        if (words.length == 0) return await reply.fail("Não foram encontradas palavras válidas.");

        filters[name] = {
            words,
            exempt: {},
            level: 1
        }

        await message.guild.filters(filters);
        return await reply.succ("Adicionado filtro " + name + ": ", words.join(", "));
    }

    options() { return {

    }}

    help = "Cria um novo filtro de conteudo.";
    userPerms = ["MANAGE_GUILD"];
    args = [{
        type: "string",
        info: "O nome do filtro",
        max: "100",
        example: "badwords"
    }, {
        type: "string",
        info: "As palavras do filtro. Apenas letras.",
        example: "heck frick meme dang shoot"
    }];
}

module.exports = CreateFilterCommand;

const { Command } = require("../../Nitro");

class ListFiltersCommand extends Command {

    async run({ message, bot, reply, t }) {
        let [name] = message.args;
        const filters = await message.guild.filters();
        const keys = Object.keys(filters);

        if (!name) return keys.length > 0 ?
            await reply.succ("Filtros neste server: ", keys.join(", ")) :
            await reply.warn("Não existem filtros.");

        if (!filters[name]) return await reply.fail("Filtro `" + name + "` não existe.");

        const w = filters[name].words;
        return w.length == 0 ?
            await reply.warn("Filtro `" + name + "` não tem palavras.") :
            await reply.succ("O filtro `" + name + "` tem: ", w.join(", "));

    }

    help = "Mostra a lista de palavras em um filtro.";
    usage = "";
    alias = ["filterlist", "wordlist", "listwords"];
    userPerms = ["MANAGE_GUILD"];
    arg = {
        type: "string",
        info: "O nome do filtro",
        example: "badwords",
        default: null,
    };
}

module.exports = ListFiltersCommand;

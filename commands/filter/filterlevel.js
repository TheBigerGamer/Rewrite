const { Command } = require("../../Nitro");

class LevelFilterCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [filt, lvl] = message.args;

        const filters = await message.guild.filters();
        let filter = filters[filt];
        if (!filter) return reply.fail("Filtro não existe.");

        filter.level = parseInt(lvl);
        filters[filt] = filter;

        await message.guild.filters(filters);
        return reply.succ(`Filtro ${filt} definido para o nível`, lvl);
    }

    help = "Define a restrição de um filtro.";
    args = [{
        type: "string",
        info: "O filtro para defenir.",
        example: "badwords"
    }, {
        type: "selection",
        info: "`1` - Apenas palavras que correspondam exatamente, `2` - repõe caracteres que se assemelhem parcialmente, `3` - se a palavra é encontrada em qualquer lugar.",
        items: ["1", "2", "3"],
        example: "2"
    }]
}

module.exports = LevelFilterCommand;

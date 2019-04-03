const { Command } = require("../../Nitro");

class DelFilterCommand extends Command {

    async run({ message, bot, reply, t }) {
        let [name] = message.args;
        let filters = await message.guild.filters();
        name = name.toLowerCase();
        if (!filters[name]) return await reply.fail("Filtro não existe.");

        delete filters[name];

        await message.guild.filters(filters);
        return reply.succ("Filtro eliminado.");
    }

    help = "Delete a filter.";
    alias = ["deletefilter", "del-filter"];
    userPerms = ["MANAGE_GUILD"];
    arg = {
        type: "string",
        info: "O nome do filtro",
        max: "100",
        example: "badwords"
    };
}

module.exports = DelFilterCommand;

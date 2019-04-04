const { Command } = require("../../Nitro");

class PingCommand extends Command {
    async run({ message, bot, reply, t }) {
        await reply(t.PING_TEST());
        const ping = Date.now() - reply.sent.createdTimestamp;
        const ws = bot.ping;

        return await reply.edit(t.PING_DONE(ping, ws));
    }

    help = "Vê se o Warlock ainda está vivo";
    userPerm = "ADMINISTRATOR";
}

module.exports = PingCommand;

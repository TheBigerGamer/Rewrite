const { Command } = require("../../Nitro");

class AvatarCommand extends Command {

    async run({ message, bot, reply, t }) {
        const user = message.args[0];
        return reply("Aqui está o avatar de: " + user.username + "\n" + user.displayAvatarURL({ size: 2048 }))
    }

    help = "Obtem o avatar de alguém";
    usage = "{}avatar @Funnbot";
    args = [{
        type: "user",
        info: "O utilizador que tem o avatar",
        default: true
    }];
}

module.exports = AvatarCommand;

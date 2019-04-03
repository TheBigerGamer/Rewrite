const { Command } = require("../../Nitro");

class BurnCommand extends Command {
    async run ({message, bot, reply, t}) {
        const [user] = message.args;
        reply(`**${message.author.username}** *queimou* **${user.username}**\nPrecisas de algum gelo para esse player? :snowflake:\nhttps://4.bp.blogspot.com/-nNkz-s3K3d8/V1YemadBDWI/AAAAAAAAXJ0/dpWI9OFnjZkjIkCipgP4JXQlC69KloTpgCLcB/s1600/giphy.gif`);
    }

    help = "QUEIMA um utilizador.";
    args = [{
        type: "user",
        info: "O player para QUEIMAR.",
        example: "@Nerd"
    }]
}

module.exports = BurnCommand;

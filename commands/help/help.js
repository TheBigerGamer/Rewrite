const { Command, HELP, PERMISSIONS } = require("../../Nitro");

class HelpCommand extends Command {

    async run({ message, bot, reply, t }) {
        const commands = bot.commands;
        const groups = bot.CommandLoader.groups;

        if (!message.checkSuffix) {
            let fields = [];
            for (let [key, name] of Object.entries(HELP)) {
                if (!groups[key]) continue;
                const value = Object.keys(groups[key]).map(c => `\u200b  **[${c}](http://a.a)** - ${commands[c].help}`).join("\n");
                fields.push({
                    name: `${name}`,
                    value,
                });
            }

            const embed = bot.embed;
            embed.fields = fields;
            embed.setColor("#36393E");
            return message.author.send(embed).catch(logger.debug);
        }

        const [c] = message.args;
        const cmd = c.toLowerCase();
        const command = commands[cmd];
        if (!command) return await reply.fail("Comando Inválido");

        const embed = bot.embed
            .setTitle(cmd)
            .setDescription(command.help)
            .nitroColor()
        command.alias.length <= 0 || embed.addField("Aliases", command.alias.join(", "));
        command.userPerms.length <= 0 || embed.addField("Perms de Utilizador", command.userPerms.map(p => PERMISSIONS[p]));
        command.botPerms.length <= 0 || embed.addField("Perms do Bot", command.botPerms.map(p => PERMISSIONS[p]));

        let usage = message.prefix + cmd;

        if (command.args.length > 0) {
            let example = message.prefix + cmd;
            let argInfo = [];
            for (let arg of command.args) {
                if (arg.default !== undefined) usage += ` **[${arg.typeText || arg.type}]**`;
                else usage += ` **<${arg.typeText || arg.type}>**`;
                argInfo.push(`**${arg.typeText || arg.type}** - ${arg.info}`);
                example += ` ${arg.example}`
            }

            embed.addField("Utilização", usage)
                .addField("Argumentos", argInfo.join("\n"))
                .addField("Exemplo", '`' + example + '`');

        } else embed.addField("Utilização", usage);

        return await reply(embed);
    }

    help = "Mostra todos os comandos";
    usage = "{}help or {}help <command>";
    dm = true;
    alias = ["commands", "cmds"];
}

module.exports = HelpCommand;

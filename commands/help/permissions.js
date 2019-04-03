const { Command } = require("../../Nitro");

class PermissionsCommand extends Command {

    async run({ message, bot, send, t }) {
        let txt = `**Permissions**
        O Warlock usa as permissões de discórdia embutidas para lidar com permissões de comando
        Por exemplo, para conceder permissão ao moderador para banir um usuário, simplesmente conceda a ele permissão para Banir Membros.
        Por causa disso, normalmente não há necessidade de configurar as permissões e os usuários normais não podem acessar os comandos destrutivos.
        As permissões necessárias para um comando podem ser vistas com \`${message.prefix}help cmd\``.unindent()

        send(txt)
    }

    help = "Tutorial no sistema de permissões do Warlock";
    cooldown = 5
}

module.exports = PermissionsCommand;

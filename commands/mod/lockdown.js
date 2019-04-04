const { Command } = require("../../Nitro");

class LockDownCommand extends Command {

    async run({ message, bot, reply, t }) {
        const ms = message.args[0];
        const role = (message.args[1] || message.guild).id;

        const overwrites = message.channel.permissionOverwrites.get(role) || {};
        let current = null;
        if (overwrites.allowed.has("SEND_MESSAGES")) current = true;
        else if (overwrites.denied.has("SEND_MESSAGES")) current = false;

        await message.channel.overwritePermissions(role, { SEND_MESSAGES: false });
        await reply.warn(`Canal bloqueado porque ${ms.toString()}.`, ' digita `unlock` para terminar o lockdown.');

        async function end() {
            await message.channel.overwritePermissions(role, { SEND_MESSAGES: current });
            await reply.succ("Lockdown terminou.");
            c.stop();
        }

        const timer = setTimeout(end, ms.milliseconds());

        const filt = m => m.authorPerm("MANAGE_CHANNEL");
        const c = message.channel.createMessageCollector(filt, ms.milliseconds());

        c.on("collect", m => {
            if (m.content.toLowerCase() === "unlock") {
                clearTimeout(timer);
                end();
            }
        });
    }

    help = "Faz um canal entrar em lockdown.";
    userPerms = ["MANAGE_CHANNELS"];
    botPerms = ["MANAGE_CHANNELS"];
    args = [{
        type: "duration",
        info: "A duração do lockdown.",
        example: "2m30s",
        min: 1000,
        max: 36e6
    }, {
        type: "role",
        info: "Cargo opcional do lockdown, em vez do @everyone",
        example: "@Users",
        default: null
    }];
}

module.exports = LockDownCommand;

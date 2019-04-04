const { Command, TIME } = require("../../Nitro");

class SlowModeCommand extends Command {

    async run({ message, bot, reply, t }) {
        const [time, wait] = message.args;
        const chan = message.channel;
        if (!message.channel.permissionsFor(bot.user).has("MANAGE_ROLES"))
            return await reply.fail("Preciso de permissão para manusear cargos neste server.");

        const role = await createRole(chan);
        const col = handleUserMessages(chan, role, time, wait);
        const unlock = collectUnlock(chan, time);

        const endTimer = setTimeout(() => {
            endSlowmode(chan, col, unlock, role)
        }, time.milliseconds());

        unlock.on("collect", async m => {
            if (m.content === "speedup") {
                endSlowmode(chan, col, unlock, role, endTimer);
            }
        })

        return await reply(`**Slowmode ativado para ${time.toString()}.\nPodes enviar uma mensagem em cada ${wait} segundos.\nModeradores podem escrever \`speedup\` para acabar mais cedo.**`);
    }

    help = "Ativa o Slowdown em um canal.";
    userPerm = "MANAGE_GUILD";
    botPerm = "MANAGE_ROLES";
    args = [{
        type: "duration",
        info: "A duração do slowdown",
        example: "10m",
        min: 10 * TIME.second,
        max: 10 * TIME.day
    }, {
        type: "number",
        info: "O número de segundos entre cada mensagem.",
        example: "12",
        min: 5,
        max: 20,
        default: 10
    }];
}

function endSlowmode(chan, col, unlock, role, endTimer) {
    chan.send("**Slowmode terminou.**");
    col.stop();
    unlock.stop();
    role.delete("warlock-slowmode");
    if (endTimer) clearTimeout(endTimer);
}

function collectUnlock(channel, time) {
    const filter = m => (!m.author.bot && m.channel.permissionsFor(m.author).has("MANAGE_MESSAGES"));
    const col = channel.createMessageCollector(filter, { time: time.milliseconds() });
    return col;
}

function handleUserMessages(channel, role, time, wait) {
    const filter = m => (!m.author.bot && !m.channel.permissionsFor(m.author).has("MANAGE_MESSAGES"));
    const col = channel.createMessageCollector(filter, { time: time.milliseconds() });
    col.on("collect", async m => {
        const member = await m.guild.members.fetch(m.author);
        member.roles.add(role, "warlock-slowmode em " + channel.id);
        setTimeout(() => {
            member.roles.remove(role, "warlock-slowmode em " + channel.id);
        }, wait * 1000);
    });
    return col;
}

async function createRole(channel) {
    const guild = channel.guild;
    const role = await guild.roles.create({
        data: {
            name: "slowmode-" + channel.id,
        },
        reason: "warlock-slowmode em " + channel.id,
    });
    await channel.updateOverwrite(role, {
        SEND_MESSAGES: false
    }, 'Warlock slowdown em ' + channel.id);
    return role;
}

module.exports = SlowModeCommand;

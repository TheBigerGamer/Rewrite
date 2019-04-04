const { Command, Image } = require("../../Nitro");

class DeathNoteCommand extends Command {
    //?deathnote @balde2876#5645
    async run({ message, bot, reply, t }) {
        const [user] = message.args;

        const { ctx, canvas } = Image.canvas(520, 283);
        const background = Image.canvasImage(Image.getStaticFile("death"));
        
        ctx.drawImage(background, 0, 0, 520, 283);
        ctx.font = "18px Papyrus";
        ctx.fillText(user.username, 275, 80);
        const file = Image.send(canvas.toBuffer());

        return reply(`**${message.author.username}** *adicionou* **${user.username}** *ao seu death note*`, file);
    }

    help = "Põe alguém no teu death note";
    botPerm = "ATTACH_FILES";
    cooldown = 5;
    arg = {
        type: "user",
        info: "O utlilizador para adicionar.",
        example: "@user"
    }
}

module.exports = DeathNoteCommand;

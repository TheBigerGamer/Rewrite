const { Command } = require("../../Nitro");

class PlaylistCommand extends Command {

    async run ({message, bot, reply, t}) {
        const [num] = message.args;

        const vc = message.member.voiceChannel;
        if (!vc) return reply.warn("Entra num canal de voz para executar este comando.");

        const player = bot.player.check(vc);
        if (!player) return reply.warn("Não há música a tocar.")

        let playlist = player.playlistInfo(num);

        const embed = bot.embed
            .setTitle("Playlist")
            .nitroColor()
            .setFooter(`Page ${num}/${playlist.pageCount}`)
            .addBetterField("A tocar agora", `[${playlist.nowPlaying.title}](${playlist.nowPlaying.url}) (${playlist.nowPlaying.length}) \n`);
        for (let i = 0; i < playlist.tracks.length; i++) {
            let track = playlist.tracks[i];
            embed.addBetterField(track.index + 1, `[${track.title}](${track.url}) (${track.length})`);
        }
        embed.addBetterField("Tempo total", playlist.totalLength.toString(), true)

        return reply(embed);
    }

    help = "Obtem a playlist atual.";
    arg = {
        type: "num",
        info: "O número da página da playlist.",
        example: "1",
        min: 1,
        default: 1
    }
}

module.exports = PlaylistCommand;

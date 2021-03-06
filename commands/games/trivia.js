const { Command } = require("../../Nitro");
const snekfetch = require("snekfetch")
const h2p = require("html2plaintext")
const stringSim = require("string-similarity")

let categories = {
    "general knowledge": 9,
    books: 10,
    film: 11,
    music: 12,
    musicals: 13,
    television: 14,
    "video games": 15,
    "board games": 16,
    science: 17,
    computers: 18,
    mathematics: 19,
    mythology: 20,
    sports: 21,
    geography: 22,
    history: 23,
    politics: 24,
    art: 25,
    celebrities: 26,
    animals: 27,
    vehicles: 28,
    comics: 29,
    gadgets: 30,
    anime: 31,
    cartoons: 32
}

class TriviaCommand extends Command {

    async run({ message, bot, send, t }) {
        let diff = message.args[0] || "random"
        let cat = message.args[1] || "random"

        snekfetch.get(genUrl(diff, cat)).then(response => {
            let res = response.body
            if (res.response_code !== 0 || !res.results || !res.results[0]) return send("Erro do Api")
            let trivia = res.results[0]
            if (!trivia.question ||
                !trivia.correct_answer ||
                !trivia.difficulty ||
                !trivia.category) return send("Erro do Api")

            trivia.worth = {
                "easy": 20,
                "medium": 50,
                "hard": 100
            }[trivia.difficulty] || 0

            play(message, bot, send, trivia)

        }).catch(e => {
            console.log(e)
            return send("Erro do Api")
        })
    }

            help = "Joga trivia";
            usage = "{}trivia <difficulty> <category> eg. {}trivia medium geography";
            alias = ["quiz"];
            args = [{
                type: "selection",
                info: "QUe dificuldade?",
                example: "medium",
                items: ["easy", "medium", "hard", "random"],
                default: "random"
            }, {
                type: "selection",
                info: "Que categoria?",
                example: "geography",
                items: [...Object.keys(categories), "random"],
                default: "random"
            }];
}

module.exports = TriviaCommand;

async function play(message, bot, send, trivia) {
    if (message.channel.cache.exists("trivia")) return send("Um jogo já está a decorrer");
    message.channel.cache.set("trivia");
    let {
        question,
        correct_answer,
        incorrect_answers,
        difficulty,
        category,
        worth
    } = trivia
    correct_answer = h2p(correct_answer)
    incorrect_answers = incorrect_answers.map(s => h2p(s));
    incorrect_answers.push(correct_answer);
    incorrect_answers = shuffle(incorrect_answers);
    let embed = new bot.Embed()
    embed.title = "`Trivia`"
    embed.addField("Categoria", category)
        .addField("Dificuldade", difficulty)
        .addField("Recompensa", worth + ":dollar:")
        .addField("Questão", h2p(question))
        .addField("Escolhas", "**" + incorrect_answers.map((k, i) => (i + 1) + ". " + k).join(" - ") + "**")
        .setFooter("Tens 20 segundos para responder. Responde utilizando um número, tens uma tentativa.")
        .setColor("#4DD0D9")
        .setAuthor(message.guild.name, message.guild.iconURL)

    send({ embed })
    let guessed = {};
    let collector = message.channel.createMessageCollector(m => {
        if (m.author.bot) return false
        let guess = parseInt(m.content);
        if (!guess) return false;
        if (guessed[m.author.id]) return false;
        guessed[m.author.id] = true;
        if (checkAnswer(correct_answer, incorrect_answers, guess)) {
            collector.stop("VENCIDO")
            win(bot, message, m.author, worth)
        } else {
            m.failReact();
        }
        return false
    }, { time: 20000 })

    collector.on("end", (c, reason) => {
        message.channel.cache.delete("trivia");
        if (reason === "time") {
            return send("**Ninguém adivinhou. A resposta correta era: " + correct_answer + "**");
        }
        if (reason === "wrong") {
            return send("**ERROU! A resposta correta era: " + correct_answer + "**");
        }
    })
}

async function win(bot, message, user, worth) {
    message.channel.cache.delete("trivia");
    message.channel.send(`**${user.tag} acertou a questão corretamente, aqui está a tua recompensa.**`)
    await message.guild.triviaWin(user.id);
    await user.wallet.add(worth);
}

function shuffle(array) {
    var i = 0,
        j = 0,
        temp = null

    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }

    return array;
}

function checkAnswer(correct, answers, input) {
    let a = answers[input - 1];
    if (!a) return false;
    return a === correct;
}

function genUrl(d, c) {
    let diff = d === "random" ? "" : "&difficulty=" + d
    let cat = c === "random" ? "" : "&category=" + (categories[c])
    return `https://opentdb.com/api.php?amount=1${cat}${diff}`
}

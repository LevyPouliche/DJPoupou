const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const token = "";
const clientId = "";

const player = createAudioPlayer();

// Commande Slash à enregistrer
const commands = [
    {
        name: "join",
        description: "Fait rejoindre le bot à votre canal vocal",
    },
    {
        name: "play",
        description: "Joue une chanson depuis YouTube",
        options: [
            {
                name: "url",
                type: 3, // STRING
                description: "URL de la vidéo YouTube",
                required: true,
            },
        ],
    },
    {
        name: "leave",
        description: "Fait quitter le bot du canal vocal",
    },
];

// Enregistrement des commandes Slash
const rest = new REST({ version: "10" }).setToken(token);
(async () => {
    try {
        console.log("Enregistrement des commandes slash...");
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log("Commandes enregistrées !");
    } catch (error) {
        console.error("Erreur lors de l'enregistrement des commandes : ", error);
    }
})();

client.once("ready", () => {
    console.log(`${client.user.tag} est en ligne et prêt !`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, options, member, guild } = interaction;

    if (commandName === "join") {
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply("tes ben cave envoye");
        }

        joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

        return interaction.reply("Chu la tchuuuu");
    }

    if (commandName === "play") {
        const voiceChannel = member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply("Tes nul");
        }

        const url = options.getString("url");
        if (!ytdl.validateURL(url)) {
            return interaction.reply("Veuillez fournir une URL valide de YouTube !");
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });

         // Utilisation de ytdl pour créer un flux audio
    const stream = ytdl(url, {
        filter: 'audioonly', // Récupère uniquement l'audio
        highWaterMark: 1 << 25, // Optimisation pour les vidéos longues
    });
    
    const resource = createAudioResource(stream, {
        inlineVolume: true,
    });

    resource.volume.setVolume(1); // Volume à 100%
    
        const player = createAudioPlayer();
        connection.subscribe(player)
        player.play(resource)
        return interaction.reply("Quelle musique de marde!");
    }

    const { getVoiceConnection } = require('@discordjs/voice');

if (commandName === "leave") {
    try {
        const connection = getVoiceConnection(guild.id);
        if (connection) {
            connection.destroy(); // Déconnecte proprement le bot
            return interaction.reply("Je quitte le canal vocal !");
        } else {
            return interaction.reply("Je ne suis pas dans un canal vocal !");
        }
    } catch (error) {
        console.error("Erreur lors de l'exécution de la commande leave :", error);
        return interaction.reply("Une erreur est survenue lors de la tentative de quitter le canal vocal.");
    }
}

});

client.login(token);


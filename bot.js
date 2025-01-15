const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = '';

client.once('ready', () => {
    console.log('Bot en ligne !');
});

client.login(TOKEN);

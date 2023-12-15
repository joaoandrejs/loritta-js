const { Client, Partials, GatewayIntentBits, Collection } = require('discord.js'); // npm i discord.js
const client = new Client({
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
    Partials.GuildScheduledEvent, // for guild events
    Partials.User, // for discord user
    Partials.ThreadMember, // for thread member
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
      GatewayIntentBits.GuildMembers, // for guild members related things
      GatewayIntentBits.GuildBans, // for manage guild bans
      GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
      GatewayIntentBits.GuildIntegrations, // for discord Integrations
      GatewayIntentBits.GuildInvites, // for guild invite managing
      GatewayIntentBits.GuildVoiceStates, // for voice related things
      GatewayIntentBits.GuildPresences, // for user presence things
      GatewayIntentBits.GuildMessages, // for guild messages things
      GatewayIntentBits.MessageContent, // enable if you need message content things
  ]
}) 

const fs = require('fs')
const firebase = require('firebase/app');
require('firebase/database')

module.exports = client;
client.slashCommands = new Collection();
client.commands = new Collection();

const { token, apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId, } = process.env;

// Entre com seu realtime firebase
firebase.initializeApp({
  apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId, measurementId,
});

// Carrega as handlers (comandos que carregam eventos, comandos etc..)
fs.readdirSync('./handlers').forEach((handler) => {
  require(`./handlers/${handler}`)(client, token)
});

client.login(token)
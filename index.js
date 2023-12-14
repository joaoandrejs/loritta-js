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

module.exports = client;
client.SlashCommands = new Collection();
client.commands = new Collection();

const { token } = process.env;

client.on('ready', async () => {
  console.log(`Ligado com sucesso
Aplicação: ${client.user.username} (${client.user.id})
Statisticas: ${client.guilds.cache.size} servidores | ${client.users.cache.size} usuário.

Convite:
> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands
  `)
})

client.login(token)
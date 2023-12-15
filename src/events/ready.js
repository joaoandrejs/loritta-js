const { ActivityType } = require('discord.js')
const client = require("../../index");

async function UpdateStatus() {

  const RandomStatus = [
    `${client.guilds.cache.size} servidores`,
    `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} usuários`,
    'Desenolvido para VRTX',
  ],
    RandomActivity = [	
      ActivityType.Watching, 
      ActivityType.Streaming, 
      ActivityType.Playing,
      ActivityType.Listening,
      ActivityType.Custom,
      ActivityType.Competing
    ],
    RandomSts = ['online', 'dnd', `idle`]

  let i = 0,
      h = 0,
      j = 0;
  
  client.user.setActivity(
    `${RandomStatus[i++ % RandomStatus.length]}`, { type: ActivityType[j++ % ActivityType.length] })
}

client.on('ready', async () => {

  UpdateStatus()
  setInterval(() => UpdateStatus(), 1000 * 60 * 5)
  
  console.log(`Ligado com sucesso
Aplicação: ${client.user.username} (${client.user.id})
Statisticas: ${client.guilds.cache.size} servidores | ${client.users.cache.size} usuário.

Convite:
> https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands
  `)
})
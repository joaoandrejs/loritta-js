const client = require('../../index')
const { prefixo } = require('../../config.json')
const { PermissionsBitField } = require('discord.js')

const firebase = require("firebase");
const database = firebase.database();

let emoji = require("../../src/utils/emoji.js")

client.on("messageCreate", async (message) => {
  if (message.webhookID) return;
  if (message.author.bot) return;
  if (message.channel.type === 'DM') return;

  if (message.channel && message.channel.viewable && message.member.permissions.has([PermissionsBitField.Flags.SendMessages])) {

    if(message.content == `<@${client.user.id}>` || message.content == `<@!${client.user.id}>`) {
      return message.reply({ embeds: [embedbb], components: [actionRow]}) 
    };

    const args = message.content.slice(prefixo.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (!message.content.startsWith(prefixo)) return;

    let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    
    if (command) {
      
      try {
        command.run(client, message, args, database, emoji, prefixo).catch(e => { }); 
      } catch (e) {
        console.error(`ERRO: ` + e)
      }
      
    } else {
      if (!cmd || cmd === prefixo) return;
    }
    
  }
})

const { EmbedBuilder } = require('discord.js')

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports = {
  name: "eval",
  aliases: [],

  run: async(client, message, args, database, emoji, prefix) => {

    if (message.author.id !== '853402439604502529') {
      return false;
    }

    if (!args[0]) {
      message.delete().catch(e => { })
      return message.channel.error(`Cade o código burrão`);
    }

    let code = args.slice(0).join(' ');

    args = args.join(' ');

    let interaction = message;
        interaction.user = message.author;

    try {

      var evaled = eval(args);
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);  

      const embed1 = new EmbedBuilder()
      .setColor('FFFFFF')
      .setDescription(`
**entrada**
\`\`\`${code}\`\`\`
**Saida**
\`\`\`js\n${clean(evaled)}\n\`\`\``)

      return message.reply({ embeds: [embed1] })

    } 
    catch (err) {

      const embed2 = new EmbedBuilder()
      .setColor('FFFFFF')
      .setDescription(`
**Entrada**
\`\`\`${code}\`\`\`
**Saida**
\`\`\`js\n${clean(err)}\n\`\`\``)

      message.reply({ embeds: [embed2] })

}}
};

const client = require("../../index");

const firebase = require("firebase");
const database = firebase.database();

let emoji = require("../../src/utils/emoji.js")

client.on("interactionCreate", async (interaction) => {
  await client.guilds.fetch(interaction.guildId);
  const guild = client.guilds.cache.get(interaction.guildId);
  if (!guild) return interaction.followUp({ content: `${emoji.negativo} **|** Comandos só podem ser utilizados em servidores.` });
  
  const colors = {
    embed: '#FF00FF'
  }
  
  await interaction.deferReply({ ephemeral: false }).catch(e => { });

  if (interaction.isCommand()) {

      const args = [];

      for (let option of interaction.options.data) {
          if (option.type === "SUB_COMMAND") {
              if (option.name) args.push(option.name);
              option.options.forEach((x) => {
                  if (x.value) args.push(x.value);
              });
          } else if (option.value) args.push(option.value);
      }
    
    const cmd = client.slashCommands.get(interaction.commandName);
    
      if (!cmd)
        return interaction.reply({ content: `${emoji.negativo} **|** Não consegui encontrar este comando.`, ephemeral: true });

      await interaction.deferReply({ ephemeral: false }).catch(e => { });
    
      interaction.Comando = cmd.name + args.slice(0).join(' ');
    
      cmd.run(client, interaction, args, colors.embed, database, emoji);
  }
})
const fs = require('fs');
const { PermissionsBitField } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discordjs/rest');

const rest = new REST({ version: '9' }).setToken(process.env.token);

module.exports = async (client) => {
  const slashCommands = [];

  fs.readdirSync('./src/SlashCommand/').forEach(async dir => {
    const files = fs.readdirSync(`./src/SlashCommand/${dir}/`).filter(file => file.endsWith('.js'));

    for (const file of files) {
      try {
        const slashCommand = require(`../src/SlashCommand/${dir}/${file}`);
        slashCommands.push({
          name: slashCommand.name,
          description: slashCommand.description,
          type: slashCommand.type,
          options: slashCommand.options ? slashCommand.options : null,
          default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
          default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
        });

        if (slashCommand.name) {
          client.slashCommands.set(slashCommand.name, slashCommand);
          console.log(`[ ✅ Slash Command loaded ] - ${slashCommand.name}`);
        } else {
          console.log(`[ ❌ Command error ] - ${file}`);
        }
      } 
      catch (error) {
        console.error(`[ ❌ Command error ] - ${file}`);
        console.error(error);
      }
    }
  });

  try {
    await rest.put(Routes.applicationCommands('1184717329041473656'), { body: slashCommands });
    console.log('[ ✅ Todos os slashs registrados ]');
  } catch (error) {
    console.error('[ ❌ Erro ao carregar os slashs ]');
    console.error(error);
  }
};

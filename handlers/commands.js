const fs = require('fs');

module.exports = (client) => {
  fs.readdirSync('./src/commands/').forEach(dir => {
    const files = fs.readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith('.js'));
    if (!files || files.length <= 0) {
      console.log(`No commands found in directory ${dir}`);
      return;
    }
    files.forEach((file) => {
      try {
        let command = require(`../src/commands/${dir}/${file}`);
        if (command) {
          client.commands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => {
              client.aliases.set(alias, command.name);
            });
          }
          console.log(`[ ✅ Command loaded ] - ${command.name}`);
        } else {
          console.log(`[ ❌ Command error ] - ${file}`);
        }
      } catch (error) {
        console.error(`[ ❌ Command error ] - ${file}`);
        console.error(error);
      }
    });
  });
};

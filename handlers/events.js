const fs = require('fs');

module.exports = (client) => {
  fs.readdirSync('./src/events/').filter((file) => file.endsWith('.js')).forEach((event) => {
    try {
      require(`../src/events/${event}`);
      console.log(`[ ✅ Evento carregado ] - ${event.split('.js')[0]}`);
    } catch (error) {
      console.error(`[ ⛔ Event não carregado ]: ${event}`);
      console.error(error);
    }
  });
};

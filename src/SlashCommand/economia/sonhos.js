const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const { PUXAR_SALDO_USER, UPDATE_SONHOS_USER } = require('../../utils/functions.js')

module.exports =  {
  "name": "sonhos",
  "description": `Lista de comandos sobre sonhos`,
  "type": ApplicationCommandType.ChatInput,
  "options": [
    {
      "name": "atm",
      "description": "⌊Economia⌉ Verifique quantos sonhos você, ou outro usuário, tem!.",
      "type": ApplicationCommandType.ChatInput,
      "options": [
        {
          "name": "user",
          "type": ApplicationCommandOptionType.User,
          "description": "O usuário que você deseja desvendar os sonhos dele",
          "required": false,
        }
      ],
    },
    {
      "name": "pagar",
      "description": "⌊Economia⌉ Transfira sonhos para outro usuário",
      "type": ApplicationCommandType.ChatInput,
      "options": [
        {
          name: "user",
          type: ApplicationCommandOptionType.User,
          description: "O usuário que irá receber os sonhos",
          required: true,
        },
        {
          name: "quantity",
          type: ApplicationCommandOptionType.String,
          description: "A quantidade de sonhos que você deseja enviar",
          required: true,
        },
      ],
    },
  ],

  run: async (client, interaction, args, colors, database) => {

    const Sub_Command = interaction.options.getSubcommand();

    switch (Sub_Command) {

      case 'atm': {
          let user = interaction.options.getUser('user')
          if (!user) user = interaction.user;
  
          let { sonhos } = await PUXAR_SALDO_USER(interaction, user)
  
          if (user.id !== interaction.user.id) 
            return interaction.followUp({ content: `💸 **|** ${interaction.user} ${user} tem **${sonhos} sonhos**.` })
  
          return interaction.followUp({ content: `💸 **|** ${user} Você tem **${sonhos} sonhos!** Você está em **#0 lugar** no ranking, veja outros ostentadores em \`/sonhos top\` ` })
      }
        break;

      case 'pagar': {

        let user = interaction.options.getUser('user')
        if ([user.id].includes(interaction.user.id)) return interaction.followUp(`:x: **|** Transferência concluída com sucesso! Você não recebeu nada de si mesmo, porque você está tentando transferir sonhos para si mesmo!`)

        let quantity = interaction.options.getUser('quantity')
        if (quantity < 1) return interaction.followUp(`:sob: **|** Uau, incrível! Você vai transferir zero sonhos, maravilha! Menos trabalho para mim, porque isso significa que não preciso preparar uma transação para você.`)
        
        UPDATE_SONHOS_USER(message, message.author, '+', 100)
        }
        break;

      case 'rank': {}
        break;

      case 'transações': {}
        break;
        
    }
    
  }
}
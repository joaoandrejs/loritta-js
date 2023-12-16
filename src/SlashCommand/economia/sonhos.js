const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { PUXAR_SALDO_USER, UPDATE_SONHOS_USER } = require('../../utils/functions.js')
const ms = require('ms');

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
          "name": "user",
          "type": ApplicationCommandOptionType.User,
          "description": "O usuário que irá receber os sonhos",
          "required": true,
        },
        {
          "name": "quantity",
          "type": ApplicationCommandOptionType.String,
          "description": "A quantidade de sonhos que você deseja enviar",
          "required": true,
        },
        {
          "name": "expires_after",
          "description": "Após quanto tempo a transação será automaticamente cancelada",
          "type": ApplicationCommandOptionType.String,
          "required": false,
          "choices": [
              {
                "name": "1 minuto",
                "value": `${1 * 60 * 1000}`
              },
              {
                "name": "5 minutos",
                "value": `${5 * 60 * 1000}`
              },
              {
                "name": "15 minutos",
                "value": `${15 * 60 * 1000}`
              },
              {
                "name": "1 hora",
                "value": `${1 * 60 * 60 * 1000}`
              },
              {
                "name": "6 horas",
                "value": `${6 * 60 * 60 * 1000}`
              },
              {
                "name": "12 horas",
                "value": `${12 * 60 * 60 * 1000}`
              },
              {
                "name": "24 horas",
                "value": `${24 * 60 * 60 * 1000}`
              },
              {
                "name": "3 dias",
                "value": `${3 * 24 * 60 * 60 * 1000}`
              },
              {
                "name": "7 dias",
                "value": `${7 * 24 * 60 * 60 * 1000}`
              }
            ]

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
        if ([user.id].includes(interaction.user.id)) return interaction.followUp({ content: `:x: **|** Transferência concluída com sucesso! Você não recebeu nada de si mesmo, porque você está tentando transferir sonhos para si mesmo!`})

        let quantity = interaction.options.getString('quantity')
        if (quantity < 1) return interaction.followUp({ content: `:sob: **|** Uau, incrível! Você vai transferir zero sonhos, maravilha! Menos trabalho para mim, porque isso significa que não preciso preparar uma transação para você.`})

        let Sonhos_interaction = await PUXAR_SALDO_USER(interaction, user)
        if (quantity > Sonhos_interaction) return interaction.followUp({ content: `:xob: **|** Você não tem **${quantity} sonhos** para fazer isso! Você precisa conseguir mais **${quantity - Sonhos_interaction} sonhos** para continuar.`})
        
        let expires_after = interaction.options.getString('expires_after');
        if (!expires_after) expires_after = '900000'; // 15 minutos
        
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("aceitar").setStyle(ButtonStyle.Primary).setEmoji('🤝').setLabel('Aceitar Transferência').setDisabled(false),
          
          new ButtonBuilder().setCustomId("cancelar").setStyle(ButtonStyle.Danger).setEmoji('😭').setLabel('Cancelar').setDisabled(false),
        ), row_accepted = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("accepted").setStyle(ButtonStyle.Primary).setEmoji('🤝').setLabel('Transferência Aceita').setDisabled(true),
        ), row_canceled = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("canceled").setStyle(ButtonStyle.Secondary).setEmoji('❓').setLabel('Transferência Cancelada').setDisabled(true),
          )
        
        let msg = await interaction.followUp({ content: `💸 **|** Você está prestes a transferir **${quantity} sonhos** para ${user}!
💰 **|** Para confirmar a transação, ${user} deve aceitar a transação até: <t:${~~((Date.now() + ms(expires_after))/1000)}:F> (<t:${~~((Date.now() + ms(expires_after))/1000)}:R>)`, components: [row] })

        const coletor = msg.createMessageComponentCollector({ time: ms(expires_after) });

        coletor.on('collect', async(i) => {
          i.deferUpdate()

          if (i.customId == 'aceitar') {

            if (![user.id].includes(i.user.id)) {
              return interaction.followUp({ content: `😡 | Espere um pouquinho... Você não é ${user}! Isso não é para você, sai daqui!`, ephemeral: true })
            }

            await UPDATE_SONHOS_USER(interaction, interaction.user, '-', quantity, `{perdeu.sonhos.pay}`)
            await UPDATE_SONHOS_USER(interaction, user, '+', quantity, `{ganhou.sonhos.pay}`)

            let Sonhos_interaction = await PUXAR_SALDO_USER(interaction, interaction.user)
            let Sonhos_User = await PUXAR_SALDO_USER(interaction, user)

            await msg.edit({ components: [row_accepted] });
            coletor.stop();

            return interaction.followUp({ content: `🤝 **|** Transferência realizada com sucesso! ${user} recebeu **${quantity} sonhos**!
🧑 **|** ${ineraction.user} agora possui **${Sonhos_interaction} sonhos** e está em **#0 lugar** no ranking!
👩 **|** ${user} agora possui **${Sonhos_User} sonhos** e está em **#0 lugar** no ranking!` })
          }
          else
            if (i.customId == 'cancelar') {
              await interaction.editReply({ components: [row_canceled] });
            }
          
        })
        
      }
        break;

      case 'rank': {}
        break;

      case 'transações': {}
        break;
        
    }
    
  }
}
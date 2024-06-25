const { ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { PUXAR_SALDO_USER, UPDATE_SONHOS_USER, CONVERTER_STR } = require('../../utils/functions.js') 
const ms = require('ms');

module.exports =  {
  "name": "coinflipbet",
  "description": `O clássico "Gire uma moeda e veja se irá cair cara ou coroa!", mas agora envolvendo sonhos!`,
  "type": ApplicationCommandType.ChatInput,
  "options": [
    {
        "name": "user",
        "type": ApplicationCommandOptionType.User,
        "description": "O usuário que você deseja apostar com",
        "required": true,
    },
    {
        "name": "sonhos",
        "type": ApplicationCommandOptionType.String,
        "description": "A quantidade de sonhos que você deseja apostar",
        "required": true,
    },
  ],

  run: async (client, interaction, args, colors, database) => {
    try {
        const user = interaction.options.getUser('user');
        if (!user) return interaction.followUp({ content: `:x: **|** Você deve mencionar um usuário.` })
        
        if (user.bot & user.id !== client.user.id) return interaction.followUp({ content: `:x: **|** Você não pode apostar com o bot.` })
        
        if (user.id === interaction.user.id) return interaction.followUp({ content: `:x: **|** Você não pode apostar com si mesmo.` })
        
        const quantia = interaction.options.getString('sonhos');
        const { sonhos } = await PUXAR_SALDO_USER(interaction, interaction.user)

        const number = ['all', 'tudo'].includes(quantia) ? sonhos : CONVERTER_STR(quantia);

        if (isNaN(number)) return interaction.followUp({ content: `:x: **|** \`${quantia}\` não é um número válido.` })

        if (sonhos < quantia) return interaction.followUp({ content: `:x: **|** Você não tem **${sonhos} sonhos** para apostar!` })
        
        if (quantia < 100) return interaction.followUp({ content: `:x: **|** Você não pode apostar com quantidade menor que 1000 sonhos.` })
        
        /// Carteira do usuário:
        const sonhosUser = await PUXAR_SALDO_USER(interaction, user).then(res => res.sonhos)
        
        if (sonhosUser < quantia) return interaction.followUp({ content: `:x: **|** ${user} não possui dinheiro suficiente para apostar com você!` })
        
        const taxa = (number * 95) / 100; 

        const cc = ['cara', 'coroa'];
        const escolha1 = cc[Math.random() * cc.length | 0];
        const escolha2 = escolha1 == 'cara' ? 'coroa' : 'cara';
        
        let row = '';
        const UpdateRow = async (ID, Style, Emoji, Label, Disabled) => {
          return row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId(ID)
            .setStyle(Style)
            .setEmoji(Emoji)
            .setLabel(Label)
            .setDisabled(Disabled),
          )
        }

        await UpdateRow('participar', ButtonStyle.Primary, '✅', 'Participar (1/2)', false)
        
        const msg = await interaction.followUp({ content: 
`💸 **|** ${user}, ${interaction.user} quer fazer uma aposta com você! Cada um irá pagar **${number} sonhos (${number - taxa} sonhos de taxa para jogar rs)**. Se cair **${escolha1}**, voce irá pagar **${taxa} sonnhos**, se cair **${escolha2}**, ${user} irá ganhar **${taxa} sonhos**! E aí, vai encarar?
🤝 **|** Para confirmar a aposta, você e ${user} devem clicar em ✅`, components: [row] });

        let id = interaction.user.id;
        const coletor = msg.createMessageComponentCollector({ filter: (i) => i.user.id === id });

        coletor.on('collect', async (int) => {
          int.deferUpdate();

          try {

            if (int.customId === 'participar') {
              coletor.stop();
              await UpdateRow('participar', ButtonStyle.Primary, '✅', 'Participar (2/2)', true)
              msg.edit({ components: [row] });

              const { sonhos } = await PUXAR_SALDO_USER(interaction, interaction.user)
              
              if (sonhos < quantia) return interaction.followUp({ content: `:x: **|** Você não tem **${sonhos} sonhos** para apostar!` })
              
              if (quantia < 100) return interaction.followUp({ content: `:x: **|** Você não pode apostar com quantidade menor que 1000 sonhos.` })
              
              /// Carteira do usuário:
              const sonhosUser = await PUXAR_SALDO_USER(interaction, user).then(res => res.sonhos)
              
              if (sonhosUser > quantia) return interaction.followUp({ content: `:x: **|** ${user} não possui dinheiro suficiente para apostar com você!` }) 
              
              const resultado = cc[Math.random() * cc.length | 0];
              const ganhador = resultado == escolha1 ? interaction.user : user;
              const perdedor = resultado == escolha1 ? user : interaction.user;

              await UPDATE_SONHOS_USER(interaction, perdedor, '-', number);
              await UPDATE_SONHOS_USER(interaction, ganhador, '+', taxa);
              return msg.reply({ content: `:coin: **|** **${resultado}**!
:moneybag: **|** Parabéns, ${ganhador}, você ganhou **${taxa} sonhos**! Patrocinado por: ${perdedor}` })
            }

          } catch (error) {
            return interaction.followUp({ content: `:x: **|** Ocorreu um erro, tente novamente mais tarde.` })
          }
        });

    } catch (error) {
        console.error(error)
        return interaction.followUp({ content: `:x: **|** Ocorreu um erro, tente novamente mais tarde.` })
    }
    

  }
}
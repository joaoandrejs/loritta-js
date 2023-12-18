const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { UPDATE_SONHOS_USER, PUXAR_INFOS_USER } = require('../../utils/functions.js')

module.exports =  {
	"name": "daily",
	"description": `⌊Economia⌉ Pegue sua Recompensa Diária de Sonhos para ganhar sonhos!`,
	"type": ApplicationCommandType.ChatInput,
	
	run: async (client, interaction, args, colors, database) => {

		let { cooldowns } = await PUXAR_INFOS_USER(interaction, interaction.user)
		
		if (cooldowns.Daily) {
			const Embed = new EmbedBuilder()
			.setColor(colors)
			.setDescription(`⏰ **|** Seu premio diário será liberado para coletar: **<t:${~~((cooldowns.Daily)/1000)}:R>**.`)

			return interaction.followUp({ embeds: [Embed], fetchReply: true, ephemeral: false  });
		}

		let Daily_quantity = Math.floor(Math.random() * (4000 - 1000 + 1));
		
		await database.ref(`economia/cooldowns/${interaction.user.id}`).update({
			daily: Date.now()
		})

		await UPDATE_SONHOS_USER(interaction, interaction.user, '+', Daily_quantity, `{emoji.entrada} {ganhou.sonhos.daily} | ${Daily_quantity}`)

		const Embed = new EmbedBuilder()
		.setColor(colors)
		.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dyanmic: true }) })
		.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dyanmic: true}) })
		.setDescription(`💵 **|** Você recolheu sua recompensa diária e recebeu: **${(Daily_quantity)} sonhos**`)
		
		return interaction.followUp({ embeds: [Embed], fetchReply: true, ephemeral: false  });
	}
}
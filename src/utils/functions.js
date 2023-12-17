const firebase = require("firebase");
const database = firebase.database();
const pms = require('parse-ms');
const ms = require('ms');

module.exports = {
	
	TRANSACTION_USER_UPDATE: async function(interaction, user, mensagem) {
			if (!interaction || !user || !mensagem) {
				console.warn(`[LOGS] - [DETAILS_NOT_PROVIDED] (TransactionUpdate): Algum dos objetos não foi definido`);
				if (interaction) interaction.followUp({ content: `[DETAILS_NOT_PROVIDED] Ocorreu um erro ao atualizar as transaçõesatualizar as transações` });
				return;
			}

			if (user.bot) return;

			let tempo1 = `<t:${~~(Date.now() / 1000)}:d>`;
			let tempo2 = `<t:${~~(Date.now() / 1000)}:t>`;
			let tempo3 = `<t:${~~(Date.now() / 1000)}:R>`;

			return database.ref(`/economia/Transações/${user.id}`).once('value').then(async function(snapshot) {
				let transações = (snapshot.val() && snapshot.val().transações) || [];

				let Mensagem = `[${tempo1} ${tempo2}] | ${tempo3} ${mensagem}`;
				transações.unshift(Mensagem);

				transações = transações.slice(0, 10);

				return database.ref(`economia/Transações/${user.id}`).set({
						transações: transações,
				});
			});
		},

	/*
	interaction - param padrção
	user - param padrção
	MoreOrLess - String - '+' (soma o dinheiro do usuario) / '-' (Subtrai o dinheiro do usuario)
	quantity - String - Quantia que vai ser atualizada
	transactions - String - Mensagem de transação
	*/
	UPDATE_SONHOS_USER: async function(interaction, user, MoreOrLess, quantity, transactions) {
		if (user.bot) return;

		if (transactions) require('./functions.js').TRANSACTION_USER_UPDATE(interaction, transactions, user)

		const snapshot = await database.ref(`/sonhos/${user.id}`).once('value');
		let sonhos = (snapshot.val() && snapshot.val().sonhos);
		if (sonhos === undefined || sonhos === null) sonhos = 0;

		switch (MoreOrLess) {
			case '+':
				return database.ref(`/sonhos/${user.id}`).update({ sonhos: sonhos + quantity })

			case '-':
				return database.ref(`/sonhos/${user.id}`).update({ sonhos: sonhos - quantity })

			default:
				throw new Error('[UPDATE_SONHOS_USER] - Ocorreu um erro ao atualizar os sonhos do usuário')

				return;
		}
	},

	PUXAR_SALDO_USER: async function(interaction, user) {

		try {

			const snapshot = await database.ref(`/sonhos/${user.id}`).once('value');
			let sonhos = (snapshot.val() && snapshot.val().sonhos);
			if (sonhos === undefined || sonhos === null) sonhos = 0;

			return { sonhos };

		} catch (error) {

			console.error('Ocorreu um erro ao carregar os sonhos do usuário:', error.message);
			throw error;
		}

	},
	
	PUXAR_INFOS_USER: async function(interaction, user) {

		const sonhos = await require('./functions').PUXAR_SALDO_USER(interaction, user)
		// Daily
		let DailyStats = false;

		let Tempo = 86400000;
		let daily = await database.ref(`economia/cooldowns/${user.id}`).once('value');
		let Bonus = (daily.val() && daily.val().daily);
		if (Bonus === undefined || Bonus === null) Bonus = 0;

		const time = pms(Tempo - (Date.now() - Bonus));
		if (Bonus !== null && Tempo - (Date.now() - Bonus) > 0) DailyStats = Bonus + Tempo
		else DailyStats = false;
		
		return { sonhos: sonhos.sonhos, cooldowns: { Daily: DailyStats } }
	}

}
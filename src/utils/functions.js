const firebase = require("firebase");
const database = firebase.database();

module.exports = {

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

  /*
  interaction - param padrção
  user - param padrção
  MoreOrLess - String - '+' (soma o dinheiro do usuario) / '-' (Subtrai o dinheiro do usuario)
  quantity - String - Quantia que vai ser atualizada
  transactions - String - Mensagem de transação
  */
  UPDATE_SONHOS_USER: async function(interaction, user, MoreOrLess, quantity, transactions) {
    if (user.bot) return;
    
    if (transactions) require('./functions.js').TRANSACTION_USER_UPDATE(interaction, transação, user)
    
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
  }
  
}
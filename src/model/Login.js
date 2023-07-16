const db = require('./bd')
const Conta = require('./Conta')

//Cria conexão com o banco de dados na tabela Login
const Login = db.sequelize.define('logins', {
    idLogin: {
        type: db.Sequelize.INTEGER,
        primaryKey: true
    },
    data: {
        type: db.Sequelize.DATE
    }

})

Login.belongsTo(Conta.Conta, {
    constraint: true,
    foreignKey: 'contaCpf'
})

Conta.Conta.hasMany(Login, {
    foreignKey: 'contaCpf'
})



//Funções CRUD da tabela Logins
module.exports = {
    //Retorna todos os Logins do banco de dados
    async get(){
        return await Login.findAll();

    },
    post(newLogin){
        Login.create(newLogin);
    }
}
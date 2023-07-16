const db = require('./bd');

//Cria conexão com o banco de dado na tabela contas
const Conta = db.sequelize.define('contas', {
    cpf: {
        type: db.Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
    },
    user: {
        type: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.STRING
    },
    admin: {
        type: db.Sequelize.STRING
    },
    createdAt: {
        type: db.Sequelize.DATE
    },
    updatedAt: {
        type: db.Sequelize.DATE
    },
})

//Funções CRUD da tabela Contas.
module.exports = {
    Conta: Conta, 
    async get(){
        const contas = await Conta.findAll();

        contas.map(async conta => conta instanceof Conta)

        return contas;
    },
    async getById(cpf){
        return await Conta.findByPk(cpf)
    },
    post(newConta){
        Conta.create(newConta);
    },
    update(updConta){
        Conta.update(updConta, {
            where:{
                cpf: updConta.cpf
            }
        })

    },
    
    
    delete(funcCpf){
        Conta.destroy({
            where: {
                id: funcCpf
            }
        })
    }
}
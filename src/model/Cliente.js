const db = require('./bd')

//Cria conexão com o banco de dados na tabela Clientes
const Cliente = db.sequelize.define('clientes', {
    cpf: {
        type: db.Sequelize.UUID,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING
    },
    telefone: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    createdAt: {
        type: db.Sequelize.DATE
    },
    updatedAt: {
        type: db.Sequelize.DATE
    },
})

module.exports = {
    Cliente: Cliente,
    //Função que pega todos os clientes
    async get(){
        const clientes =  await Cliente.findAll()

        return clientes;
    },
    //Função que envia novo cliente para o banco de dados
    post(newCliente){
        Cliente.create(newCliente)
    },
    //Função que atualiza cliente no banco de dados
    update(updCliente, clienteCpf){
        data = updCliente;

        Cliente.update(updCliente, {
            where: {
                cpf: clienteCpf
            }
        })
    },
    //Função que deleta o cliente do banco de dados
    delete(clienteCpf){
        Cliente.destroy({
            where: {
                id: clienteCpf
            }
        })
    }
}
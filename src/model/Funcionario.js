const db = require('./bd')

const Conta = require('./Conta')

//Cria conexão com o banco de dados na tabela funcionarios
const Funcionario = db.sequelize.define('funcionarios', {
    cpf: {
        type: db.Sequelize.UUID,
        primaryKey: true
    },
    nome: {
        type: db.Sequelize.STRING
    },
    sobrenome: {
        type: db.Sequelize.STRING
    },
    telefone: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    tat: {
        type: db.Sequelize.BOOLEAN
    },
    prc: {
        type: db.Sequelize.BOOLEAN
    },
    createdAt: {
        type: db.Sequelize.DATE
    },
    updatedAt: {
        type: db.Sequelize.DATE
    },
})

Funcionario.belongsTo(Conta.Conta, {
    constraint: true,
    foreignKey: 'contaCpf'
})



//Funções CRUD da tabela Funcionarios
module.exports = {
    Funcionario: Funcionario,
    async get(){

        return await Funcionario.findAll();
    },
    async getById(cpf){

       const funcionario =  await Funcionario.findByPk(cpf, {include: Conta.Conta})

       //console.log(funcionario.conta.user)

       return funcionario
    },
    post(newFuncionario){
        Funcionario.create(newFuncionario);

    },
    update(newFuncionario){
        Funcionario.update(newFuncionario, {
            where: {
                cpf: newFuncionario.cpf
            }
        })
    },
    delete(funcCpf){
        Funcionario.destroy({
            where: {
                id: funcCpf
            }
        })
    }
}
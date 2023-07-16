const db = require('./bd')

const Funcionario = require('../model/Funcionario')
const Cliente = require('../model/Cliente')

//Cria conexão com banco de dados na tabela Agendamentos
const Sessao = db.sequelize.define('agendamentos', {
    id: {
        type: db.Sequelize.INTEGER,
        primaryKey: true
    },
    data: {
        type: db.Sequelize.DATE
    },
    valor: {
        type: db.Sequelize.FLOAT
    },
    createdAt: {
        type: db.Sequelize.DATE
    },
    updatedAt: {
        type: db.Sequelize.DATE
    },
    tat: {
        type: db.Sequelize.BOOLEAN
    },
    prc: {
        type: db.Sequelize.BOOLEAN
    },
})

Sessao.belongsTo(Funcionario.Funcionario, {
    constraint: true,
    foreignKey: 'funcionarioCpf'
})

Funcionario.Funcionario.hasMany(Sessao, {
    foreignKey: 'funcionarioCpf'
})

Sessao.belongsTo(Cliente.Cliente, {
    constraint: true,
    foreignKey: 'clienteCpf'
})

Cliente.Cliente.hasMany(Sessao, {
    foreignKey: 'clienteCpf'
})

//Funções CRUD dos Agendamentos
module.exports = {
    //Pega todas as sessões com dados atualiados dos clientes e funcionarios
    async get(){
        const sessoes = await Sessao.findAll(); //Resgata todas as sessões
        const clientes = await Cliente.get(); //Requisita todos os Clientes
        const funcionarios = await Funcionario.get() //Requisita todos os funcionarios
            
        //Atualiza dados de clientes e funcionarios da sessão.
            sessoes.map((sessao) => {
                sessao instanceof Sessao;

                let cliente = clientes.find(cliente=>sessao.clienteCpf == cliente.cpf)
                sessao.nomeCliente = cliente.nome

                let funcionario = funcionarios.find(func => sessao.funcionarioCpf == func.cpf)
                sessao.nomeArtista = funcionario.nome 
                
                if(sessao.tat == 1) sessao.checkedTat = "checked"; else sessao.checkedTat = "unchecked";
                if(sessao.prc == 1) sessao.checkedPrc = "checked"; else sessao.checkedPrc = "unchecked";
            })
            

            return sessoes

        

        
    },
    async getById(idSessao){

        return  await Sessao.findByPk(idSessao, {include: [Cliente.Cliente, Funcionario.Funcionario]});

    },
    //Pega todas os agendamentos de um funcionario específico
    async getFunc(paramCpf){
        const clientes = await Cliente.get();
        const funcionarios = await Funcionario.get();
        const sessoes = await Sessao.findAll({
            where: {
                funcionarioCpf: paramCpf
            }
        })
        sessoes.map(sessao=> {
            sessao instanceof Sessao;

            let cliente = clientes.find(cliente=>sessao.clienteCpf == cliente.cpf)
            sessao.nomeCliente = cliente.nome
                    

            let funcionario = funcionarios.find(func => sessao.funcionarioCpf == func.cpf)
            sessao.nomeArtista = funcionario.nome 

            if(sessao.tat == 1) sessao.checkedTat = "checked"; else sessao.checkedTat = "unchecked";
            if(sessao.prc == 1) sessao.checkedPrc = "checked"; else sessao.checkedPrc = "unchecked";

        })
        return sessoes

    },
    //Pega todas os agendamentos de um cliente específico
    async getCli(paramCpf){
        const clientes = await Cliente.get();
        const funcionarios = await Funcionario.get();
        const sessoes = await Sessao.findAll({
            where: {
                clienteCpf: paramCpf
            }
        })
        sessoes.map(sessao=> {
            sessao instanceof Sessao;

            let cliente = clientes.find(cliente=>sessao.clienteCpf == cliente.cpf)
                
                sessao.nomeCliente = cliente.nome
                    

                let funcionario = funcionarios.find(func => sessao.funcionarioCpf == func.cpf)
                sessao.nomeArtista = funcionario.nome 

            if(sessao.tat == 1) sessao.checkedTat = "checked"; else sessao.checkedTat = "unchecked";
            if(sessao.prc == 1) sessao.checkedPrc = "checked"; else sessao.checkedPrc = "unchecked";

        })
        

        return sessoes

    },
    post(newSessao){
        Sessao.create(newSessao)

    },
    update(updSessao, idSessao){

        Sessao.update(updSessao, {
            where: {
                id: idSessao
            }
        })
    },
    delete(idSessao){
        Sessao.destroy({
            where: {
                id: Number(idSessao)
            }
        })
    },
}
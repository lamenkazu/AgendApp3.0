const LoginController = require('./LoginController')

const Cliente = require('../model/Cliente');


module.exports = {

    //Rota para pagina inicial dos Clientes. Lista todos os clientes e envia para o Front-End
    async index (req, res) {
        LoginController.checaLogin(req, res);

        const clientes = await Cliente.get()

        const profile = await LoginController.updateProfile();

        return res.render("pages/mostraClientes", {profile, clientes})
    },

    //Rota para formulario de criação de um novo cliente.
    async cadastro (req, res) {
        LoginController.checaLogin(req, res);

        const profile = await LoginController.updateProfile();
        
        return res.render("pages/inserirCliente", {profile})
    },
    //Envia o cadastro para o banco de Dados
    post (req, res) {

        Cliente.post({
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.tel,
            email: req.body.email,
            createdAt: Date.now(),
            updatedAt: Date.now()

        })
    
        res.redirect('/clientes')
    
    },
    //Rota para formulario de atualização de um cliente já cadastro
    async edit(req, res){

        LoginController.checaLogin(req, res);

        const clienteCpf  = req.params.cpf

        const clientes = await Cliente.get()

        //Cliente é um cliente específico de clientes, selecionado pelo ID comparado com os parametros da rota.
        const cliente = clientes.find(cliente => cliente.cpf === clienteCpf)
        if(!cliente){
            return res.send("Cliente não encontrado")
        }

        const profile = await LoginController.updateProfile();
        return res.render("pages/clienteEdit", {profile, cliente })

    },
    //Envia a atualizão do cliente feita na edição
    async update(req, res){
        const clienteCpf = req.params.cpf //CPF do cliente recebido por parâmetro

        const clientes = await Cliente.get()

        //cliente é o Cliente de Clientes com o CPF do parâmetro
        const cliente = clientes.find(cliente => cliente.cpf == clienteCpf)
        if(!cliente){
            return res.send("Cliente não encontrado")
        }

        //Cria constante que atualiza os dados do Cliente
        const updatedCli = {
            ...cliente,
            nome: req.body.nome,
            cpf: req.body.cpf,
            telefone: req.body.tel,
            email: req.body.email
        }

        //Atualiza no banco de dados com os novos dados.
        Cliente.update(updatedCli, clienteCpf);
        
        return res.redirect("/clientes")

    },
    //Deleta um cliente selecionado pelo CPF
    delete(req, res){

        LoginController.checaLogin(req, res);

        const clienteCpf = req.params.cpf;

        Cliente.delete(clienteCpf);
       
        return res.redirect("/clientes");

    }
    


}
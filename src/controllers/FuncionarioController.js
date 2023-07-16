const Conta = require('../model/Conta')
const Funcionario = require('../model/Funcionario')
const Login = require('../model/Login')

const LoginController = require('./LoginController')

module.exports = {
    /*Rota para pagina inicial dos Funcionarios. Lista todos os funcionarios e envia para o Front-end. 
      Caso o funcionario Logado seja administrador, 
      ele tem opções de Editar e Listar Seções, caso seja funcionario comum, estas opções não aparecem.    
    */
    async index (req, res) {
        LoginController.checaLogin(req, res);

        const profile = await LoginController.updateProfile();

        const funcionarios = await Funcionario.get()

        return res.render("pages/mostraFuncionarios", {profile, funcionarios})
    },

    /* Rota para formulario de criação de novo Funcionario. Apenas Administradores podem cadastrar um novo funcionario.
    Esta rota não é acessada por funcionarios comuns. 
    */
    async cadastro (req, res) {
        LoginController.checaLogin(req, res);

        const profile = await LoginController.updateProfile();

        if(profile.admin == 1){
            
            return res.render("pages/inserirFuncionario", {profile})

        }else return res.redirect("/")
        
        
    },

    
    //Rota para envio do cadastro de funcionarios.
    //Funcionarios e Contas são criadas em tabelas separadas através dos dados do mesmo formulário.
    post (req, res) {

        //Transforma os valores marcados na checkbox em TINYINT
        if(req.body.admin == 'on') req.body.admin = 1; else req.body.admin = 0;
        if(req.body.tat == 'on') req.body.tat = 1; else req.body.tat = 0;
        if(req.body.prc == 'on') req.body.prc = 1; else req.body.prc = 0;

        Conta.post({
            cpf: req.body.cpf,
            user: req.body.user,
            senha: req.body.senha,
            admin: req.body.admin,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
    
        Funcionario.post({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            cpf: req.body.cpf,
            telefone: req.body.tel,
            email: req.body.email,
            tat: req.body.tat,
            prc: req.body.prc,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            contaCpf: req.body.cpf
        })
        
        
        res.redirect('/funcionarios')
    },
    /*
        Rota para formulário de edição do Funcionario.
    */
    async edit (req, res){

        LoginController.checaLogin(req, res);

        //Pega funcionarios e contas
        const cpf = req.params.cpf //CPF do funcionario recebido por parâmetro
        const profile = await LoginController.updateProfile(); //Pega dados do perfil 
        const funcionario = await Funcionario.getById(cpf);
        if(!funcionario){
            return res.send("Funcionario não encontrado");
        }

        //Marca como verdadeiro ou falso baseado na marcação da CheckBox
        if(funcionario.conta.admin == 1) funcionario.conta.checkedAdmin = "checked"; else funcionario.conta.checkedAdmin = "unchecked";
        if(funcionario.tat == 1) funcionario.checkedTat = "checked"; else funcionario.checkedTat = "unchecked";
        if(funcionario.prc == 1) funcionario.checkedPrc = "checked"; else funcionario.checkedPrc = "unchecked";

       
        return res.render("pages/funcionarioEdit", {profile, funcionario})
    },
    //Rota para atualização de funcionario no banco de dados
    async update(req, res){

        const funcCpf = req.params.cpf //CPF do funcionario recebido por parametro

        //Pega tabelas de funcionarios e contas
        const funcionarios = await Funcionario.get()
        const contas = await Conta.get();

        //Encontra funcionario e conta com o CPF enviado por parâmetro
        let funcionario = funcionarios.find(func => func.cpf === funcCpf)
        let conta = contas.find(conta => conta.cpf === funcCpf);
        if(!funcionario || !conta){
            return res.send("Funcionario não encontrado");
        }


        if(req.body.admin == 'on') req.body.admin = 1; else req.body.admin = 0;
        if(req.body.tat == 'on') req.body.tat = 1; else req.body.tat = 0;
        if(req.body.prc == 'on') req.body.prc = 1; else req.body.prc = 0;

        //Cria constante que atualiza o funcionario 
        const updatedFunc = {
            ...funcionario,
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            cpf: req.body.cpf,
            telefone: req.body.tel,
            email: req.body.email,
            tat: req.body.tat,
            prc: req.body.prc,
            updatedAt: Date.now()
        }
        //Cria constante que atualiza a Conta
        const updatedConta = {
            ...conta,
            cpf: req.body.cpf,
            user: req.body.user,
            senha: req.body.senha,
            admin: req.body.admin,
            updatedAt: Date.now()
        
        }

        //Atualiza o novo funcionario no banco de dados
        funcionario = updatedFunc;
        Funcionario.update(funcionario);

        //Atualiza a nova conta no banco de dados
        conta = updatedConta;
        Conta.update(conta);
    
        
        res.redirect('/funcionarios')
    },

    //Rota GET para exibição de Logins específicos de cada funcionario.
    async logs(req, res){

        const profile = await LoginController.updateProfile();
        const logins = await Login.get()
        const cpf = req.params.cpf;

        //Checa Permissão para acesso
        LoginController.checaLogin(req, res);
        if(profile.admin != 1){
            res.redirect("/clientes")
        }

        const loginsEspecificos = [];

        logins.map(login => {
            if(login.contaCpf === cpf)
                loginsEspecificos.push(login)
        })


        return res.render("pages/mostrarLogins", {profile, logins: loginsEspecificos})

    },

    //Rota GET para um funcionario alterar seu login e senha
    async alterarSenha(req, res){
        LoginController.checaLogin(req, res);

        const cpf = req.params.cpf;

        const profile = await LoginController.updateProfile();

        const conta = await Conta.getById(cpf);
      

        return res.render('pages/alterarSenha', {profile, conta})
    },

    //Rota POST para alteração da senha ou nome de usuario
    async updateSenha(req, res){

        const cpf = req.params.cpf
        const conta = await Conta.getById(cpf);


        if((req.body.senhaAntiga === conta.senha) && (req.body.senhaNova === req.body.senhaNovaR)){

            const updConta = {
                ...conta,
                cpf: req.body.cpf,
                user: req.body.user,
                senha: req.body.senhaNovaR,
                updatedAt: Date.now()
            }

            console.log(updConta.cpf)

            Conta.update(updConta);
    
        }

        res.redirect("/clientes")

    },

    //Deleta funcionario do banco de dados
    delete(req, res){

        LoginController.checaLogin(req, res);

        const funcCpf = req.params.cpf; //CPF do funcionario recebido por parâmetro

        //Deleta Conta e Funcionario de suas respectivas tabelas
        Conta.delete(funcCpf)
        Funcionario.delete(funcCpf)

        return res.redirect("/funcionarios");
    }
    
}
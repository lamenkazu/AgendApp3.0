const Sessoes = require('../model/Sessao')
const Cliente = require('../model/Cliente')
const Funcionario = require('../model/Funcionario')

const LoginController = require('./LoginController')

module.exports = {
    //Rota para exibição de sessões. 
        async index (req, res) {
            LoginController.checaLogin(req, res);

            const sessoes = await Sessoes.get();

            const clientes = await Cliente.get();
            const funcionarios = await Funcionario.get()

            const profile = await LoginController.updateProfile();
            
            return res.render("pages/mostrarSessoes", {profile, sessoes, funcionarios, clientes})
        },
        //Rota para formulario de agendamento de sessão para um novo cliente.
        async agendamento (req, res) {
            LoginController.checaLogin(req, res);
        
            const clienteCpf = req.params.cpf

            const clientes = await Cliente.get()
        
            const cliente = clientes.find(cliente => cliente.cpf === clienteCpf)
            if(!cliente){
                return res.send("Cliente não encontrado")
            }

            const profile = await LoginController.updateProfile();

            return res.render("pages/agendarTrabalho",  {profile, cliente} )
        },
        //Envio do formulario de agendamento para o banco de dados.
        async post (req, res) {

            const profile = LoginController.getProfile();


            const sessoes = await Sessoes.get()
            let ultimoId = Number(sessoes[sessoes.length - 1]?.id) || 0;

            if(req.body.tat == 'on') req.body.tat = 1; else req.body.tat = 0;
            if(req.body.prc == 'on') req.body.prc = 1; else req.body.prc = 0;

            if(profile.admin == 1){
                Sessoes.post({
                    id: ultimoId + 1,
                    data: req.body.horario,
                    valor: req.body.txtValor,
                    tat: req.body.tat,
                    prc: req.body.prc,
                    funcionarioCpf: req.body.funcCpf,
                    clienteCpf: req.body.cpf,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })

            }else if(profile.admin == 0) {
                Sessoes.post({
                    id: ultimoId + 1,
                    data: req.body.horario,
                    valor: req.body.txtValor,
                    tat: req.body.tat,
                    prc: req.body.prc,
                    funcionarioCpf: profile.cpf,
                    clienteCpf: req.body.cpf,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })
            }

            

            return res.redirect("/sessoes")

        },
        //Rota para edição de funcionario 
        async edit(req, res){

            LoginController.checaLogin(req, res);

            const profile = await LoginController.updateProfile();

            const idSessao = Number(req.params.id);
            const sessao = await Sessoes.getById(idSessao)
            const funcionario = await Funcionario.getById(sessao.funcionario.cpf)
            
            if(!sessao){
                return res.send("Sessão não encontrada")
            }

            if(sessao.tat == 1) sessao.checkedTat = "checked"; else sessao.checkedTat = "unchecked";
            if(sessao.prc == 1) sessao.checkedPrc = "checked"; else sessao.checkedPrc = "unchecked";

            

            
            return res.render("pages/agendamentoEdit", {profile, sessao, funcionario})

        },
        //Envio de dados atualizados do funcionario.
        async update(req, res){

            const profile = LoginController.getProfile();

            const idSessao = Number(req.params.id);
            let updSessao;

            const sessoes = await Sessoes.get()
            const sessao = sessoes.find(sessao => sessao.id == idSessao)
            if(!sessao){
                return res.send("Sessão não encontrada")
            }


            if(req.body.tat == 'on') req.body.tat = 1; else req.body.tat = 0;
            if(req.body.prc == 'on') req.body.prc = 1; else req.body.prc = 0;

            if(profile.admin == 1){
                updSessao = {
                    ...sessao,
                    data: req.body.horario,
                    valor: req.body.txtValor,
                    tat: req.body.tat,
                    prc: req.body.prc,
                    funcionarioCpf: req.body.funcCpf
                }

            } else{
                 updSessao = {
                    ...sessao,
                    data: req.body.horario,
                    valor: req.body.txtValor,
                    tat: req.body.tat,
                    prc: req.body.prc,
                }
            }
               
            Sessoes.update(updSessao, idSessao);

            

            res.redirect("/sessoes")

        },
        //Opção para Administradores: Lista Sessões específicas de algum funcionario com todos os seus clientes.
        async listaSessoesFuncionarios (req, res) {
            LoginController.checaLogin(req, res);

            const sessoes = await Sessoes.getFunc(req.params.cpf)

            const clientes = await Cliente.get();

            const funcionarios = await Funcionario.get()

            const profile = await LoginController.updateProfile();
            
            return res.render("pages/mostrarSessoes", {profile, sessoes, funcionarios, clientes})
        },
        //Opção para Administradores: Lista Sessões específicas de um único cliente com todos os funcionarios com quem ele agendou
        async listaSessoesClientes(req, res){
            LoginController.checaLogin(req, res);

            const sessoes = await Sessoes.getCli(req.params.cpf)

            const clientes = await Cliente.get();

            const funcionarios = await Funcionario.get()

            const profile = await LoginController.updateProfile();
            
            return res.render("pages/mostrarSessoes", {profile, sessoes, funcionarios, clientes})
        },
        //Deleta uma sessão agendada.
        delete(req, res){

            LoginController.checaLogin(req, res);
            
            const idSessao = req.params.id;

            Sessoes.delete(idSessao)

            return res.redirect("/sessoes");
        }

    }
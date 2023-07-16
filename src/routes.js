//Utiliza rotas pelo Express
const express = require("express");
const routes = express.Router();

//Faz requisição dos Controllers utilizados nas rotas
const SessaoController = require('./controllers/SessaoController')
const LoginController = require('./controllers/LoginController')
const FuncionarioController = require('./controllers/FuncionarioController')
const ClienteController =  require('./controllers/ClienteController')

//Rotas *********************************************

/**Log In e Out ******************************************* */

routes.get("/", LoginController.index)

routes.post("/login/admin", LoginController.loginAdm)

routes.post("/login/func", LoginController.loginFunc)

routes.get("/logout", LoginController.logout)

routes.get("/login/historico", LoginController.historico)

/*************************************************** */

/**Funcionarios */
routes.get("/funcionarios", FuncionarioController.index)

routes.get("/cadastroFuncionario",FuncionarioController.cadastro)

routes.post("/cadastroFuncionario", FuncionarioController.post)

routes.get("/editaFuncionario/:cpf", FuncionarioController.edit)

routes.post("/editaFuncionario/:cpf",FuncionarioController.update)

routes.get("/funcionario/logins/:cpf", FuncionarioController.logs)

routes.get("/funcionario/alterarSenha/:cpf", FuncionarioController.alterarSenha)

routes.post("/funcionario/updateSenha/:cpf", FuncionarioController.updateSenha)

routes.post("/funcionario/delete/:cpf", FuncionarioController.delete)


/*********************************************************** */

/**Clientes */
routes.get("/clientes", ClienteController.index)

routes.get("/cadastroCliente", ClienteController.cadastro)

routes.post("/cadastroCliente", ClienteController.post)

routes.get("/editaCliente/:cpf", ClienteController.edit)

routes.post("/editaCliente/:cpf", ClienteController.update)

routes.post("/cliente/delete/:cpf", ClienteController.delete)
/***************************************************** */

/**Sessoes */
routes.get("/sessoes", SessaoController.index)

routes.get("/funcionario/sessoes/:cpf", SessaoController.listaSessoesFuncionarios)

routes.get("/cliente/sessoes/:cpf", SessaoController.listaSessoesClientes)

routes.get("/agendamento/:cpf", SessaoController.agendamento)

routes.post("/agendamento/:cpf", SessaoController.post)

routes.get("/editaAgendamento/:id", SessaoController.edit)

routes.post("/editaAgendamento/:id", SessaoController.update)

routes.post("/sessao/delete/:id", SessaoController.delete)


/************************************************************************************ */

module.exports = routes;
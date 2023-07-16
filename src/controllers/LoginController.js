
const Conta = require('../model/Conta')
const Login = require('../model/Login')
const Funcionario = require('../model/Funcionario')

let logOut = {
    cpf: "",
    user: "",
    senha: "",
    admin: 0,
    createdAt: 0,
    updatedAt: 0
};

let profile = logOut

const Log = {
    //Funções Services para manutenção dos Logins

    //Checa se o Login não é vazio. Se for, retorna para pagina inicial
    checaLogin(req, res){

        if(profile.cpf == ""){
            return res.redirect("/")
        }
    },
    //Desconecta o usuário atual do sistema e o redireciona para a pagina inicial
    logout (req, res) {
        profile = logOut;
        return res.redirect("/")
    },

    //Registra o Login feito no banco de dados
    async registraLogin(conta){

        const logins = await Login.get();

        let ultimoId = Number(logins[logins.length - 1]?.idLogin) || 0;

        const registro = {
            idLogin: ultimoId + 1,
            contaCpf: conta.cpf,
            data: Date.now()
        }

        Login.post(registro)
        
    },


    //Funções de controle de Rotas

    index (req, res) {

        function longPeriodExecution(){
            return new Promise(function(resolve, reject){
                setTimeout(() => {
                    console.log('solved af 5 sec!')
                    resolve(true)
                }, 5000)
            })

        }

        function shortPeriodExecution(){
            return new Promise(function(resolve, reject){
                setTimeout(() => {
                    console.log('solved af 2 sec!')
                    resolve(true)
                }, 2000)
            })
            
        }

        Promise.all([longPeriodExecution(0, shortPeriodExecution())]).then(()=> {
            console.log('is evert solved?')
        })

        console.log('Yay! done!');


        //Se já houver um Perfil conectado, redireciona para pagina de clientes.
        if(profile.cpf != ""){
            res.redirect("/clientes")
        }
        //Redireciona para o inicio se o Profile não for conectado 
        res.render("pages/login")
    },

    
    //Rota de Login para Administradores 
    async loginAdm (req, res) {

        const contas = await Conta.get() //Pega as contas do banco de dados
        
        //Mapeia cada conta de contas
        contas.map(async conta => {

            //Se o usuario e senha bater com os informados pelo formulario, define esse como o Profile
            if(req.body.usuario == conta.user && req.body.senha == conta.senha){

                profile = {
                    cpf: conta.cpf,
                    user: conta.user,
                    senha: conta.senha,
                    admin: conta.admin,
                    createdAt: conta.createdAt,
                    updatedAt: conta.updatedAt
                }

                //Se esse perfil pertencer a um administrador, efetua o login. Senão, desconecta o perfil pois não é adminstrador
                if(profile.admin == 1){

                    Log.registraLogin(profile)
                    res.redirect("/funcionarios");

                }else Log.logout(req, res);

            }

        })


         
    },

    //Rot para Login de Funcionarios - funciona da mesma forma que pra Administrador
    async loginFunc(req, res)  {

        const contas = await Conta.get()

        contas.map(async conta => {
    
            if(req.body.usuario_func == conta.user && req.body.senha == conta.senha){
                
                profile = {
                    cpf: conta.cpf,
                    user: conta.user,
                    senha: conta.senha,
                    admin: conta.admin,
                    createdAt: conta.createdAt,
                    updatedAt: conta.updatedAt
                }
                
                if(profile.admin == 0){
                    Log.registraLogin(profile);
                    res.redirect("/clientes");
                }
                    
                else
                    Log.logout(req, res);
                
                
                
            }
        })

        

    },
    //Atualiza dados do perfil atual para serem exibidos nas paginas.
    async updateProfile(){       

        const funcionarios = await Funcionario.get();

        let updatedProfile = Object.assign({}, profile)

        funcionarios.map(funcionario => {
            if(funcionario.cpf === profile.cpf){
                updatedProfile.nome = funcionario.nome;
                updatedProfile.sobrenome = funcionario.sobrenome;
                updatedProfile.telefone = funcionario.telefone;
                updatedProfile.email = funcionario.email;
                updatedProfile.tat = funcionario.tat;
                updatedProfile.prc = funcionario.prc;
            }
        })

        return updatedProfile


    },
    async historico(req, res){
        Log.checaLogin(req, res);

        const profile = await Log.updateProfile()

        const logins = await Login.get();

        if(profile.admin == 1){
            return res.render("pages/mostrarLogins", {profile, logins})
        } else return res.redirect("/clientes")


        
    }
    

}

module.exports = Log
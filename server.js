const bodyParser = require('body-parser')

const express = require('express');
const routes = require("./src/routes");
const path = require('path')

const app = express();

//Utiliza o template engine EJS
app.set("view engine", "ejs");

//Mudar a localização da views
app.set('views', path.join(__dirname, '/src/views'));

//Body Parser

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//habilta arquivos statics como a pasta Publica definida no projeto
app.use(express.static(__dirname + '/public'));

//Usar o req.body
app.use(express.urlencoded({ extended : true}));

/* Rotas */
app.use(routes);

//Abrir porta para rodar a aplicação
app.listen(8001, () => console.log("rodando na porta 8001"));
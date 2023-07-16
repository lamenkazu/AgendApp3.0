const Sequelize = require('sequelize')

//Inicia conexão com o banco de dados

const sequelize = new Sequelize('studiobodyart', 'root', '', {
    host: "localhost",
    dialect:'mysql',
    port: 3306
})


module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}
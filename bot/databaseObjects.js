// all objects to use to interact with database 
// helper functions stored here too 
const Sequelize = require('sequelize'); 

const sequelize = new Sequelize('discordbot', 'username', 'password', { 
    host: 'localhost', 
    dialect: 'sqlite', 
    logging: false, 
    storage: 'database.sqlite', 
}) ; 

// assign variable to tictactoe model 
const TicTacToe = require('./models/tictactoe.js')(sequelize, Sequelize.DataTypes); 

// export 
module.exports = { 
    TicTacToe 
}; 
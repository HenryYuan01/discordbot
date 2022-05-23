// import package 
const Sequelize = require('sequelize'); 

// create instance of sequelize (name of database, username, password) 
const sequelize = new Sequelize('discordbot', 'username', 'password', { 
    host: 'localhost', 
    dialect: 'sqlite', 
    logging: false, 
    // name of file to store database contents 
    storage: 'database.sqlite', 
}) ; 

// import tictactoe model 
require('./models/tictactoe.js')(sequelize, Sequelize.DataTypes); 

// sync() makes sure database model is same 
sequelize.sync().then(async () => { 
    console.log('Database synced'); 
    sequelize.close(); 
}).catch(console.error); 
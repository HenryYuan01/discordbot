// import libraries 
const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { REST } = require('@discordjs/rest'); 
const { Routes } = require('discord-api-types/v9'); 
const { clientID, guildID, token } = require('./config.json'); 

// define commands starting out with 
const commands = [ 
    // named tic tac toe with description 
    new SlashCommandBuilder().setName('tictactoe').setDescription('Play a game of tic-tac-toe'), 
]

// define REST object to interact with Discord API 
const rest = new REST({ version: '9' }).setToken(token) 

// REST put call, Routes takes clientID and guildID 
rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands.map(command => command.toJSON() ) }) 
    // when put finished, let us know it was successful 
    .then(() => console.log('Successfully registed application commands.')) 
    // catch errors 
    .catch(console.error); 
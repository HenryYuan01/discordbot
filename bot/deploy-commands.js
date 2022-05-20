const { SlashCommandBuilder } = require('@discordjs/builders'); 
const { REST } = require('@discordjs/rest'); 
const { Routes } = require('discord-api-types/v9'); 
const { clientID, guildID, token } = require('./config.json'); 

const commands = [ 
    new SlashCommandBuilder().setName('tictactoe').setDescription('Play a game of tic-tac-toe'), 
]

const rest = new REST({ version: '9' }).setToken(token) 

rest.put(Routes.applicationGuildCommands(clientID, guildID), { body: commands.map(command => command.toJSON() ) }) 
    .then(() => console.log('Successfully registed application commands.')) 
    .catch(console.error); 
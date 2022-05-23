// importing libraries 
const { Client, Intents, Message, MessageActionRow, MessageButton } = require('discord.js'); 
const { token } = require('../config.json'); 
const { TicTacToe } = require('./databaseObjects.js'); 

// initialize client class, passing intents field (tell Discord to send everything)
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); 

// if connection works, prints "Ready!"
client.once('ready', () => { 
    console.log('Ready!'); 
})

// event handler for message create event 
client.on('messageCreate', (message) => { 
    // make sure message came from user 
    if(message.author.id === client.user.id) return; 
    // check contents of message (if "ping") 
    if(message.content === "ping") { 
        // reply with "pong" 
        message.reply("pong"); 
    }
})


/* Tic Tac Toe */ 

// constant symbols 
let EMPTY = Symbol("empty"); 
let PLAYER = Symbol("player"); 
let BOT = Symbol("bot"); 

// define initial state of game 
let tictactoe_state 

// makeGrid() 
function makeGrid() { 
    components = []
    // repeated for each row 
    for (let row = 0; row < 3; row++) { 
        // actionRow -> row of components, each row has 3 buttons 
        actionRow = new MessageActionRow() 

        // repeated for each column 
        for (let  col = 0; col < 3; col++) { 
            // define messageButton 
            messageButton = new MessageButton()
            // customID, label, style 
                .setCustomId('tictactoe_' + row + '_' + col)

            // set value of button based on action 
            switch(tictactoe_state[row][col]) { 
                case EMPTY: 
                    messageButton 
                        .setLabel(' ')
                        .setStyle('SECONDARY')
                    break; 
                case PLAYER: 
                    messageButton 
                        .setLabel('X')
                        .setStyle('PRIMARY')
                    break; 
                case BOT: 
                    messageButton 
                        .setLabel('O') 
                        .setStyle('DANGER')
                    break; 
            }
            // messageButton type 
            actionRow.addComponents(messageButton) 
        }
        // add actionRow to components 
        components.push(actionRow) 
    }
    // return 
    return components 
}

// generate random number 
function getRandomInt(max) { 
    return Math.floor(Math.random() * max); 
}
// isDraw() 
function isDraw() { 
    // if there is empty button, game not over 
    for (let row = 0; row < 3; row++) { 
        for (let col = 0; col < 3; col++) { 
            if (tictactoe_state[row][col] == EMPTY) { 
                return false; 
            }
        }
    }
    // otherwise draw 
    return true; 
}
// isGameOver() 
function isGameOver() { 
    for (let i = 0; i < 3; i++) { 
        // check horizontally 
        if (tictactoe_state[i][0] === tictactoe_state[i][1] && tictactoe_state[i][1] == tictactoe_state[i][2] && tictactoe_state[i][2] != EMPTY) { 
            return true; 
        }
        // check vertically 
        if (tictactoe_state[0][i] == tictactoe_state[1][i] && tictactoe_state[1][i] == tictactoe_state[2][i] && tictactoe_state[2][i] != EMPTY) { 
            return true; 
        }
    }
    // diagonal, can check middle square 
    if (tictactoe_state[1][1] != EMPTY) { 
        if ((tictactoe_state[0][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2]) ||
            (tictactoe_state[2][0] == tictactoe_state[1][1] && tictactoe_state[1][1] == tictactoe_state[0][2])) { 
            return true; 
        }
    }
    // otherwise false 
    return false; 
}

// event handler for when button gets clicked 
client.on('interactionCreate', async interaction => { 
    // check if interaction is button 
    if(!interaction.isButton()) return; 
    // check if customID matches corresponding button 
    if(!interaction.customId.startsWith('tictactoe')) return; 

    // if game over, 
    if (isGameOver()) { 
        // update state of board 
        interaction.update({ 
            // show grid 
            components: makeGrid()
        })
        return; 
    }

    // in customID, position 0 is tictactoe, position 1 is row, position 2 is column 
    let parsedFields = interaction.customId.split("_")
    row = parsedFields[1] 
    col = parsedFields[2] 

    // if user clicks a non-empty button, 
    if (tictactoe_state[row][col] != EMPTY) { 
        // update board by printing message 
        interaction.update({ 
            content: "You can't select that position!", 
            components: makeGrid() 
        })
        return; 
    }
    
    // user changes button to player 
    tictactoe_state[row][col] = PLAYER; 
    
    // if game is over after user makes move, 
    if (isGameOver()) { 
        // select user from tictactoe table, findOne() only finds row 
        user = await TicTacToe.findOne({
            where: { 
                // matches same one clicking button 
                user_id: interaction.user.id
            }
        }); 
        // if user isn't in database, 
        if (!user) { 
            // create user in table 
            user = await TicTacToe.create({ 
                user_id: interaction.user.id 
            }); 
        }

        // increment user's score 
        await user.increment('score'); 

        // player won, print message 
        interaction.update({ 
            content: "You won the game of tic-tac-toe! You have now won " + (user.get('score') + 1) + " time(s).",  
            components: []
        })
        return; 
    }
    // if game is draw 
    if (isDraw()) { 
        // update game, print message 
        interaction.update({ 
            content: "The game resulted in a draw!",  
            components: []
        })
        return; 
    }
    

    /* Bot Functionality */ 
    let botRow 
    let botCol 
    do { 
        // random number between 1 and 3 (coordinates)
        botRow = getRandomInt(3) 
        botCol = getRandomInt(3) 
        // perform while the button isn't selected
    } while(tictactoe_state[botRow][botCol] != EMPTY); 
    
    // bot's move 
    tictactoe_state[botRow][botCol] = BOT; 

    // if game is over after bot move 
    if (isGameOver()) { 
        // user loses, print message, show grid as well 
        interaction.update({ 
            content: "You lost the game of tic-tac-toe!",  
            components: makeGrid()
        })
        return; 
    }
    // if game is draw 
    if (isDraw()) { 
        // update with message 
        interaction.update({ 
            content: "The game resulted in a draw!",  
            components: []
        })
        return; 
    }
    // final update, show grid 
    interaction.update({ 
        components: makeGrid() 
    })
})

// event handler 
client.on('interactionCreate', async interaction => { 
    // if not command, don't run any other code 
    if(!interaction.isCommand()) return; 

    // link to a name 
    const { commandName } = interaction; 
    if (commandName === 'tictactoe') { 
        // beginning state of game, 3x3 empty boxes 
        tictactoe_state = [
            [EMPTY, EMPTY, EMPTY], 
            [EMPTY, EMPTY, EMPTY], 
            [EMPTY, EMPTY, EMPTY] 
        ]
        // reply, components make the game interactive 
        await interaction.reply({ content: 'Playing a game of tic-tac-toe!', components: makeGrid() }); 
    }
})
// logging into Discord API 
client.login(token); 
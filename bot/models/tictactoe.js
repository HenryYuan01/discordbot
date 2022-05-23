// export sequalized model for tictactoe 
module.exports = (sequelize, DataTypes) => { 
    // define name of table 
    return sequelize.define('tictactoe', {
        // who plays the game 
        user_id: { 
            type: DataTypes.STRING, 
            // two rows do not have same value 
            primaryKey: true, 
        }, 
        // user's score 
        score: { 
            type: DataTypes.INTEGER, 
            defaultValue: 0, 
            allowNull: false, 
        }
    })
}
// import libraries 
// express sets up web server 
const express = require("express")
// instance of express server 
const app = express(); 
// port web server runs on 
const passport = require("passport"); 
const passportSetup = require("./config/passport-setup"); 
const session = require('express-session');

// local host port 
const port = 4000; 

// utilizing passport 
app.use(passport.initialize()); 
app.use(session({ secret: 'SECRET' }));

// 2 routes, for auth and callback 
app.get("/auth/discord", passport.authenticate("discord", { permissions: 8 })); 
app.get("/auth/discord/callback", passport.authenticate('discord', { 
    // in event of failure, go back one page 
    failureRedirect: '/'
}),function(req, res) { 
    // then go back to home page 
    res.redirect("http://localhost:3000/")
}); 

// listen 
app.listen(port, () => console.log(`Server is running on port ${port}`))
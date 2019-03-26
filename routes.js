require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var User = require('./UserModel');
var JWT_SECRET = process.env.JWT_SECRET;


var app = express();
//Using body-parser middleware

//Parse application/x-www-form-urlencoded body from POST
app.use(bodyParser.urlencoded({
    extended: true
  }));

//Parse application/json body from POST
app.use(bodyParser.json());


app.post('/user/createUser', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    User.addUser(email, password, function(addSuccess, errMsg){
        if (!addSuccess)
            return res.status(400).send({message: errMsg });
        else {
            var token = jwt.sign(
                {id: email}, 
                JWT_SECRET, {
                expiresIn: '24h',
                });
            return res.status(200).send({token});
        }
    });
});

//TODO
app.post('/user/login', function(req, res){
    var email = req.body.email;
    var password = req.body.password;
    User.login(email, password, function(loginSuccess, error) {
        if (!loginSuccess) {
            return res.status(403).send({message: error});
        } else {
            var token = jwt.sign(
                {id: email}, 
                JWT_SECRET, {
                expiresIn: '24h',
                });
            return res.status(200).send({token});
        }
    })
});

//TODO
app.put('/user/putSecret', function(req, res){
    var decodedToken = jwt.verify(req.body.token, JWT_SECRET);
    var email = decodedToken.id;
    var secret = req.body.secret;
    User.addSecret(email, secret, function(secretSuccess, error) {
        if (!secretSuccess) {
            return res.status(403).send({message: error});
        } else {
            return res.status(200).send({message: 'Added secret'});
        }
    });
});

//TODO
app.get('/user/guessSecret', function(req, res){
    var email = req.body.email;
    var secret = req.body.secret;
    User.guessSecret(email, secret, function(guessSuccess, error) {
        if (!guessSuccess) {
            return res.status(403).send({message: error})
        } else {
            return res.status(200).send({message: 'Guessed secret'});
        }
    });
    return res.status(500).send("Not Implemented");
});


var server = app.listen(3000, function () {
    console.log("app running on port.", server.address().port);
});

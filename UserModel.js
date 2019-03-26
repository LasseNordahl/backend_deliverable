var validator  = require('validator')

var UserModel = {};

var users = {};

// Adds a user with email and password, and passes success/failure to callback
UserModel.addUser = function(email, password, callback){
    if(!email || !validator.isEmail(email)){
        callback(false, "Email is ill-formed");
    }
    else if(email in users){
        callback(false, "Email already exists");
    }
    else if(!password){
        callback(false, "Password is ill-formed");
    }
    else{
        users[email] = { password };
        callback(true);
    }
};

UserModel.login = function(email, password, callback) {
    if (users[email] === undefined) {
        callback(false, "Email was not found in database");
    } else if (users[email].password !== password) {
        callback(false, "Password was incorrect for given email");
    } else {
        callback(true);
    }
}

UserModel.addSecret = function(email, secret, callback) {
    console.log(email, secret);
    if (users[email] === undefined) {
        callback(false, "Email was not found in database");
    } else {
        users[email] = Object.assign({ secret }, users[email]);
        console.log(users[email])
        callback(true);
    }
}

UserModel.guessSecret = function(email, secret, callback) {
    if (users[email] === undefined) {
        callback(false, "Email was not found in database");
    } else if (users[email].secret === undefined) {
        callback(false, "Secret is not defined for this user");
    } else if (users[email].secret !== secret) {
        callback(false, "Secret guess is incorrect");
    } else {
        callback(true);
    }
}

module.exports = UserModel;


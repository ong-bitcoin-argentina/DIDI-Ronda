const didJWT = require('did-jwt');
const JWT = require("../helpers/jwt");
const request = require("request-promise-native");

exports.getUser = async (token) => {
    const email = "lfalagan@gmail.com";
    return {
        phone: "2494611482",
        nick: "lfalagan",
        name: "hola",
        username: email,
        password: "1234hola123",
        jwtToken : JWT.sign({  username: email })
    }
}

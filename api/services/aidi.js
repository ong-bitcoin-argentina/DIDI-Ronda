const didJWT = require('did-jwt');
const JWT = require("../helpers/jwt");
const request = require("request-promise-native");

formatAidiResponse = async (user) => {
    const username = user.mail;
    const nick = username.split("@")[0];
    return {
        ...user,
        phone: user.phoneNumber,
        nick: nick,
        name: nick,
        username,
        jwtToken : JWT.sign({ username })
    }; 
}

exports.getUser = async (token) => {
    const { DID, PRIVATE_KEY, DIDI_SERVER } = process.env;
    const signer = didJWT.SimpleSigner(PRIVATE_KEY);
    const AIDI_JWT = await didJWT.createJWT({name: 'Ronda'}, {alg: 'ES256K-R', issuer: DID, signer});
    try {
        const response = await request({
            url: `${DIDI_SERVER}/userApp/validateUser`,
            method: "POST",
            headers: {
                Authorization: `${AIDI_JWT}`,
                origin: "Ronda",
            },
            json: true,
            body: {
                userJWT: token
            },
        });
        if (!response.data) throw new customError("Usuario invalido");
        return await formatAidiResponse(response.data);
    } catch (e) {
        console.log("No se pudo validar el usuario con aidi");
    }
    return null;
}

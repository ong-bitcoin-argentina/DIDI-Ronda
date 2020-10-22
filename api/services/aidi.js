const didJWT = require('did-jwt');
const JWT = require("../helpers/jwt");
const request = require("request-promise-native");

async function formatAidiResponse(user) {
    const uniqString = Date.now().toString(36);
    const username = user.mail;
    const emailName = username.split("@")[0];
    const cleanName = emailName.replace(/\.|\,|\+/g, '');
    const nick = `${cleanName}${uniqString}`;
    return {
        ...user,
        phone: user.phoneNumber,
        nick: nick,
        name: user.name || cleanName,
        lastname: user.lastname,
        username,
        jwtToken : JWT.sign({ username })
    }; 
}

async function createJWTForAidi() {
    const { DID, PRIVATE_KEY } = process.env;
    const signer = didJWT.SimpleSigner(PRIVATE_KEY);
    return await didJWT.createJWT({name: 'Ronda'}, {alg: 'ES256K-R', issuer: DID, signer});
}

// For auth with aidi app
exports.getUser = async (token) => {
    const { DIDI_SERVER } = process.env;
    const AIDI_JWT = await createJWTForAidi();
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

// For get updated profile
exports.getProfile = async (userDid) => {
    const { DIDI_SERVER } = process.env;
    const AIDI_JWT = await createJWTForAidi();
    const response = await request({
        url: `${DIDI_SERVER}/user/${userDid}`,
        method: "POST",
        headers: {
            Authorization: `${AIDI_JWT}`,
            origin: "Ronda",
        },
        json: true,
        body: {},
    });
    return await formatAidiResponse(response.data);
}

const didJWT = require("did-jwt");
const JWT = require("../helpers/jwt");
const request = require("request-promise-native");
const { DIDI_SERVER, DID, PRIVATE_KEY } = process.env;

async function formatAidiResponse(user) {
  const username = user.mail;
  const emailName = username.split("@")[0];
  const cleanName = emailName.replace(/\.|\,|\+/g, "");
  return {
    ...user,
    phone: user.phoneNumber,
    name: user.name || cleanName,
    lastname: user.lastname,
    username,
    jwtToken: JWT.sign({ username })
  };
}

async function createJWTForAidi() {
  const signer = didJWT.SimpleSigner(PRIVATE_KEY);
  return await didJWT.createJWT(
    { name: "Ronda" },
    { alg: "ES256K-R", issuer: DID, signer }
  );
}

async function getOptions(body) {
  const AIDI_JWT = await createJWTForAidi();
  return {
    headers: {
      Authorization: `${AIDI_JWT}`,
      origin: "Ronda"
    },
    json: true,
    body
  };
}

// For auth with aidi app
exports.getOrValidateUser = async userJWT => {
  const options = await getOptions({ userJWT });
  try {
    const response = await request({
      url: `${DIDI_SERVER}/userApp/validateUser`,
      method: "POST",
      ...options
    });
    if (!response.data) throw new customError("Usuario inválido");
    return await formatAidiResponse(response.data);
  } catch (e) {
    console.log("No se pudo validar el usuario con aidi");
  }
  return null;
};

// For get updated profile
exports.getProfile = async userDid => {
  const options = await getOptions();
  const response = await request({
    url: `${DIDI_SERVER}/user/${userDid}`,
    method: "GET",
    ...options
  });
  return await formatAidiResponse(response.data);
};

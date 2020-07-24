const crypto = require("crypto");

//This generates a unique token to use wherever we want
exports.generate = () => {
const buff = crypto.randomBytes(4);
return parseInt(buff.toString('hex'),16);
}

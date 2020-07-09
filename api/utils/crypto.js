const crypto = require("crypto");

const {
  CIPHER_KEY,
  CIPHER_ALGORITHM,
  INPUT_ENCODING,
  OUTPUT_ENCODING,
  SALT_STRING,
} = process.env;

const nonce = Buffer.alloc(16, 0);
const key = crypto.scryptSync(CIPHER_KEY, SALT_STRING, 24);

exports.cipher = text => {
  const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, key, nonce, {});
  let ciphered = cipher.update(text, INPUT_ENCODING, OUTPUT_ENCODING);
  ciphered += cipher.final(OUTPUT_ENCODING);
  return ciphered;
};

exports.decipher = ciphered => {
  const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, key, nonce, {});
  let deciphered = decipher.update(ciphered, OUTPUT_ENCODING, INPUT_ENCODING);
  deciphered += decipher.final(INPUT_ENCODING);

  return deciphered;
};

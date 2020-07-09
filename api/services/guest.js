const mailing = require("../helpers/emails");
const tokens = require("../helpers/tokenGenerator");
const JWT = require("../helpers/jwt");
const SMS = require("../helpers/phones");
const blockchain = require("./blockchain");
const crypto = require("../utils/crypto");
const { SC_FEATURES } = require("../utils/other");

const User = require("../models/user");

// MANAGERS
const user_manager = require("../managers/user");
const participant_manager = require("../managers/participant");

const { customError } = require("../helpers/errorHandler");

// PHONE FORMAT
const { normalizePhone } = require("../helpers/phones");

//LOGIN
exports.login = async (username, password) => {
  // Find user
  const user = await user_manager.byUsername(username);
  if (user === null) throw new customError("User not exists");

  const isSamePassword = await user.comparePassword(password);
  if (!isSamePassword) throw new customError("Wrong password");

  const jwtToken = JWT.sign({ username });

  const returnUser = {
    id: user._id,
    name: user.name,
    nick: user.nick,
    lastname: user.lastname,
    username: user.username,
    verified: user.verified,
    emailVerified: user.verifyToken === null,
    phone: user.phone,
    token: user.token,
    jwtToken: jwtToken,
    picture: user.picture,
  };

  return returnUser;
};

//REGISTER
exports.register = async (username, password, name, token, nick) => {
  const userExists = await user_manager.byUsername(username);

  if (userExists !== null) throw new customError("That user already exists");

  if (SC_FEATURES) {
    const rnsNickname = await blockchain.nickNameAvailable(nick);

    const nickExists = await user_manager.byNick(nick);

    if (nickExists !== null) throw new customError("That nick already exists");
    if (!rnsNickname)
      throw new customError("That nick already exists in the domain");
  }

  const data = { nick, username, password, name, token, success: true };

  return data;
};

//TOKEN VERIFICATION
exports.verify = async (username, token) => {
  const user = await user_manager.byUsername(username);
  if (user === null) throw new customError("User not exist");

  const verified = user.verifyToken === token;

  if (verified) {
    user.verifyToken = null;
    await user.save();

    const token = JWT.sign({ username: username });

    const returnUser = {
      id: user._id,
      name: user.name,
      nick: user.nick,
      verified: user.verified,
      lastname: user.lastname,
      username: user.username,
      emailVerified: user.verifyToken === null,
      phone: user.phone,
      token: token,
    };

    return { returnUser };
  }
  throw new customError("Invalid Token");
};

//FORGOT PASSWORD
exports.forgot = async username => {
  const token = tokens.generate();

  const user = await user_manager.byUsername(username);

  if (user === null) throw new customError("That user does not exists");

  user.forgotToken = token;

  await user.save();

  mailing.sendMail(
    username,
    "La Ronda",
    `Tu codigo para cambiar tu contraseña es: ${token}`
  );

  return { tokenSent: true };
};

//VERIFICATION
exports.forgotCode = async (username, token) => {
  const user = await user_manager.byUsername(username);

  if (user === null) return { valid: false };

  if (user.forgotToken == token) {
    return { valid: true };
  } else {
    return { valid: false };
  }
};

//ADD PHONE
exports.phone = async (username, phone, country) => {
  const user = await user_manager.byUsername(username);

  const phoneNumber = normalizePhone(phone, country);

  const userByPhone = await user_manager.byPhone(phoneNumber);
  if (userByPhone && userByPhone.verified)
    throw new customError("That phone already exists and it is verified", 409);

  if (user === null) throw new customError("That user does not exists");

  // Do not change the token if the user has already one
  if (!user.phoneToken) user.phoneToken = tokens.generate();

  SMS.sendVerificationCode(user.phoneToken, phoneNumber);

  await user.save();

  return { tokenSent: true };
};

//PHONE VERIFICATION
exports.phoneCode = async (username, phone, country, token) => {
  const phoneNumber = normalizePhone(phone, country);

  const user = await user_manager.byUsername(username);
  if (user === null) throw new customError("The user not exist");

  if (user.phoneToken == token) {
    const userPhone = await user_manager.byPhone(phoneNumber);

    // If userPhone exist and is verified, return error
    if (userPhone && userPhone.verified)
      throw new customError("That phone already exist and it is verified");

    if (userPhone) {
      const participants = await participant_manager.participantsOfUser(
        userPhone
      );

      participants.forEach(async p => {
        p.user = user._id;
        await participant_manager.save(p);
      });

      await user_manager.remove(userPhone);
    }

    user.phone = phoneNumber;
    user.phoneToken = null;
    user.verified = true;

    const jwtToken = JWT.sign({ username: username });

    const returnUser = {
      id: user._id,
      name: user.name,
      nick: user.nick,
      lastname: user.lastname,
      username: user.username,
      emailVerified: user.verifyToken === null,
      phone: user.phone,
      jwtToken: jwtToken,
    };

    await user.save();

    return { valid: true, auth: returnUser };
  } else {
    throw new customError("Token is incorrect");
  }
};

//SETTING NEW PASSWORD
exports.forgotNewPassword = async (username, password, token) => {
  const user = await user_manager.byUsername(username);

  if (user === null) throw new customError("That user already exists");

  if (user.forgotToken === token) {
    user.password = password;
    user.forgotToken = null;
    await user.save();

    return { changed: true };
  } else {
    return { changed: false };
  }
};

//SETTING NEW PASSWORD
exports.isOwner = async username => {
  const user = await user_manager.byUsername(username);
  if (user === null) throw new customError("The user not exist");
  const dencryptedPK = crypto.decipher(user.walletAddress);
  console.log(user);
  const walletResult = await blockchain.isOwner(user.nick, dencryptedPK);

  return { confirmed: walletResult };
};

exports.transaction = async username => {
  const user = await user_manager.byUsername(username);
  if (user === null) throw new customError("The user not exist");
  const dencryptedPK = crypto.decipher(user.walletAddress);
  const walletResult = await blockchain.transaction(dencryptedPK);

  return { confirmed: walletResult };
};

exports.getContentFromSubdomain = async userId => {
  const user = await User.findById(userId);
  if (user === null) throw new customError("The user not exist");
  const content = await blockchain.getContentFromSubdomain(user.nick);

  return content;
};

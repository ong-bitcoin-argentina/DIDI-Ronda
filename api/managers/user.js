const walletUtil = require("../utils/wallet");
const JWT = require("../helpers/jwt");
const User = require("../models/user");

exports.byUsername = async username => {
  return await User.findOne({
    username: username
  })
    .then(user => user)
    .catch(err => ({ error: `${username}: ${err}` }));
};

exports.byDID = async did => {
  return await User.findOne({
    did
  })
    .then(user => user)
    .catch(err => ({ error: `${username}: ${err}` }));
};

exports.fullByUsername = async username => {
  return await User.findOne({
    username: username
  })
    .select("+password")
    .exec()
    .then(user => user)
    .catch(err => ({ error: `${username}: ${err}` }));
};

exports.updateProfile = async (user, profile) => {
  user.name = profile.name;
  user.lastname = profile.lastname;
  user.phone = profile.phoneNumber;
  user.username = profile.mail;
  user.imageUrl = profile.imageUrl;
  await user.save();
  return user;
};

exports.byId = async id => {
  let user = null;
  try {
    user = await User.findById(id);
    return user;
  } catch (error) {
    return { error: `User id ${id}: ${error}` };
  }
};

exports.manyById = async ids => {
  try {
    const users = await User.find()
      .where("_id")
      .in(ids)
      .exec();
    return users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

exports.byNick = async nick => {
  return await User.findOne({
    nick: nick
  })
    .then(nick => nick)
    .catch(err => ({ error: `${nick}: ${err}` }));
};

exports.byPhone = async phone => {
  return await User.findOne({
    phone: phone
  })
    .then(user => user)
    .catch(err => ({ error: err }));
};

exports.saveUnverified = async (phone, name, walletAddress, walletPk) => {
  return new User({
    phone,
    name,
    verified: false,
    walletAddress,
    walletPk
  })
    .save()
    .then(newUser => newUser)
    .catch(err => ({ error: err }));
};

exports.convertToVerified = async (user, data) => {
  user.username = data.username;
  user.password = data.password;
  user.name = data.name;
  user.lastname = data.lastname;
  user.token = data.token;
  user.verifyToken = data.verifyToken;
  user.nick = data.nick;
  user.imageUrl = data.imageUrl;
  user.did = data.did;
  user.verified = true;
  user.sc = false;
  await user.save();
  return user;
};

exports.saveUser = async (
  username,
  password,
  name,
  lastname,
  token,
  verifyToken,
  nick,
  imageUrl,
  walletAddress,
  walletPk
) => {
  return await new User({
    username,
    password,
    name,
    lastname,
    token,
    verifyToken,
    nick,
    imageUrl,
    walletAddress,
    walletPk
  })
    .save()
    .then(newUser => newUser)
    .catch(err => ({ error: err }));
};

exports.save = async user => {
  return await user
    .save()
    .then(newUser => newUser)
    .catch(err => ({ error: err }));
};

exports.manyWithBalanceBelowOrEqual = async minBalance => {
  try {
    const usersWithoutBalance = await User.find()
      .where("lastBalance")
      .exists(false);

    const users = await User.find()
      .where("lastBalance")
      .lte(minBalance);
    return usersWithoutBalance.concat(users);
  } catch (error) {
    console.error(error);
    return [];
  }
};

exports.remove = async user => {
  return await user
    .remove()
    .then(user => user)
    .catch(err => ({ error: err }));
};

exports.addWallet = async (_id, walletAddress, walletPk) =>
  User.findById(_id)
    .then(u => {
      if (u) {
        u.walletAddress = walletAddress;
        u.walletPk = walletPk;
        u.save();
        return true;
      }
      console.log("User was not found when adding wallet: ", _id);
      return false;
    })
    .catch(() => false);

exports.byWalletAddress = async addr => {
  try {
    const user = await User.findOne({ walletAddress: addr });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const toDTO = async user => {
  user.walletAddress = await walletUtil.getUnencryptedAddress(
    user.walletAddress
  );
  const {
    nick,
    username,
    name,
    lastname,
    verified,
    walletAddress,
    lastBalance,
    sc,
    did,
    phone,
    imageUrl,
    createdAt,
    updatedAt,
    id
  } = user;
  return {
    nick,
    username,
    name,
    lastname,
    verified,
    walletAddress,
    lastBalance,
    sc,
    did,
    phone,
    imageUrl,
    createdAt,
    updatedAt,
    id
  };
};

exports.toDTO = toDTO;

exports.toFullDTO = async user => {
  const baseDTO = await toDTO(user);
  const {
    picture,
    walletPk,
    phoneToken,
    forgotToken,
    verifyToken,
    token,
    pictureHash
  } = user;
  return {
    ...baseDTO,
    picture,
    walletPk,
    phoneToken,
    forgotToken,
    verifyToken,
    token,
    pictureHash
  };
};

const { customError } = require("../helpers/errorHandler");
const Web3 = require("web3");
const RNS_ABI = require("../lib/abi/RNS.json");
const RONDA_REGISTRY = require("../lib/abi/RONDA_REGISTRY.json");
const RSKResolver_ABI = require("../lib/abi/RSKResolver.json");
const RONDA_ABI = require("../lib/abi/RONDA.json");
const nameHash = require("eth-ens-namehash");
const cryptoUtil = require("../utils/crypto");
const userManager = require("../managers/user");

// Env properties
const {
  RONDA_CONTRACT_OWNER,
  RONDA_CONTRACT_OWNER_PK,
  RNS_ADDRESS,
  PUBLIC_RESOLVER_ADDRESS,
  DEFAULT_ADDRESS,
  RSK_ENDPOINT,
  RONDA_REGISTRY_ADDRESS,
  RONDA_RNS_SUBDOMAIN,
  CHAIN_ID,
  GAS_PRICE_HEX,
} = process.env;

// Instance RNS
const web3 = new Web3(RSK_ENDPOINT);
const rnsInstance = new web3.eth.Contract(RNS_ABI, RNS_ADDRESS);
const rondaRegistryInstance = new web3.eth.Contract(
  RONDA_REGISTRY,
  RONDA_REGISTRY_ADDRESS
);
const publicResolverAddressInstance = new web3.eth.Contract(
  RSKResolver_ABI,
  PUBLIC_RESOLVER_ADDRESS
);

const getOwner = async nickname => {
  const hashedDomain = nameHash.hash(`${nickname}.${RONDA_RNS_SUBDOMAIN}`);
  const addr = await rnsInstance.methods.owner(hashedDomain).call({});
  return addr;
};

exports.toWei = value => web3.utils.toWei(value);

exports.nickNameAvailable = async nickname => {
  try {
    const address = await getOwner(nickname);
    return address === DEFAULT_ADDRESS;
  } catch (e) {
    throw new customError("Error checking the nickname into rns", e);
  }
};
exports.isOwner = async (nickname, address) => {
  try {
    const address2 = await getOwner(nickname);
    return address === address2;
  } catch (e) {
    throw new customError("Error checking the nickname into rns", e);
  }
};
exports.createSubdomain = async (nickname, address) => {
  const node = nameHash.hash(RONDA_RNS_SUBDOMAIN);
  const label = web3.utils.sha3(nickname);
  const setSubnodeAbi = rnsInstance.methods
    .setSubnodeOwner(node, label, address)
    .encodeABI();
  const setprice = await rnsInstance.methods
    .setSubnodeOwner(node, label, address)
    .estimateGas({ from: RONDA_CONTRACT_OWNER });
  const result = await makeTransaction(
    setSubnodeAbi,
    RONDA_CONTRACT_OWNER,
    RONDA_CONTRACT_OWNER_PK,
    rnsInstance._address,
    -1,
    setprice
  );
  return result;
};

exports.setContentToSubdomain = async (
  nick,
  contentHash,
  ownerAddress,
  ownerPk
) => {
  const contentHashed = contentHash.toString();
  const node = nameHash.hash(`${nick}.${RONDA_RNS_SUBDOMAIN}`);
  const setContent = await publicResolverAddressInstance.methods
    .setContent(node, "0x" + contentHashed)
    .encodeABI();
  const setPrice = await publicResolverAddressInstance.methods
    .setContent(node, "0x" + contentHashed)
    .estimateGas({ from: ownerAddress });
  const result = await makeTransaction(
    setContent,
    ownerAddress,
    ownerPk,
    publicResolverAddressInstance._address,
    -1,
    setPrice
  );
  return result;
};
exports.getContentFromSubdomain = async nick => {
  const node = nameHash.hash(`${nick}.${RONDA_RNS_SUBDOMAIN}`);
  const contentSubdomain = await publicResolverAddressInstance.methods
    .content(node)
    .call({});
  return contentSubdomain;
};

exports.transaction = async ownerAddress => {
  const transaction = await web3.eth.sendTransaction({
    from: RONDA_CONTRACT_OWNER,
    to: ownerAddress,
    value: "1000000000000000000",
    data: "0xdf",
  });
  return transaction;
};

exports.createRound = async (id, adminAddress) => {
  const contractInvocation = await rondaRegistryInstance.methods
    .newRonda(id, adminAddress)
    .encodeABI();
  const setprice = await rondaRegistryInstance.methods
    .newRonda(id, adminAddress)
    .estimateGas({ from: RONDA_CONTRACT_OWNER });
  const result = await makeTransaction(
    contractInvocation,
    RONDA_CONTRACT_OWNER,
    RONDA_CONTRACT_OWNER_PK,
    rondaRegistryInstance._address,
    -1,
    setprice
  );
  return result;
};

const getRoundContract = async id => {
  const ronda = await rondaRegistryInstance.methods.getRondaById(id).call({});
  return new web3.eth.Contract(RONDA_ABI, ronda[1]);
};

exports.addParticipant = async (
  id,
  participantAddress,
  exTc,
  adminAddress,
  adminPk
) => {
  const roundContract = await getRoundContract(id);
  const roundContractAddress = roundContract._address;
  const addContract = roundContract.methods
    .addParticipant(participantAddress)
    .encodeABI();
  const setprice = await roundContract.methods
    .addParticipant(participantAddress)
    .estimateGas({ from: RONDA_CONTRACT_OWNER });
  const result = await makeTransaction(
    addContract,
    adminAddress,
    adminPk,
    roundContractAddress,
    exTc,
    setprice
  );
  return result;
};

exports.addParticipants = async (roundId, addresses, adminAddress, adminPk) => {
  const roundContract = await getRoundContract(roundId);
  const roundContractAddress = roundContract._address;
  const addContract = roundContract.methods
    .addParticipants(addresses)
    .encodeABI();
  const setprice = await roundContract.methods
    .addParticipants(addresses)
    .estimateGas({ from: adminAddress });
  const result = await makeTransaction(
    addContract,
    adminAddress,
    adminPk,
    roundContractAddress,
    -1,
    setprice
  );
  return result;
};

exports.acceptInvitationToParticipate = async (
  id,
  participantAddress,
  participantPK
) => {
  const roundContract = await getRoundContract(id);
  const roundContractAddress = roundContract._address;
  const acceptContract = await roundContract.methods
    .acceptInvitationToParticipate()
    .encodeABI();
  const setprice = await roundContract.methods
    .acceptInvitationToParticipate()
    .estimateGas({ from: participantAddress });
  const result = await makeTransaction(
    acceptContract,
    participantAddress,
    participantPK,
    roundContractAddress,
    -1,
    setprice
  );
  return result;
};

exports.rejectInvitationToParticipate = async (
  id,
  participantAddress,
  participantPK
) => {
  const roundContract = await getRoundContract(id);
  const roundContractAddress = roundContract._address;
  const rejectContract = await roundContract.methods
    .rejectInvitationToParticipate()
    .encodeABI();
  const setprice = await roundContract.methods
    .rejectInvitationToParticipate()
    .estimateGas({ from: participantAddress });
  const result = await makeTransaction(
    rejectContract,
    participantAddress,
    participantPK,
    roundContractAddress,
    -1,
    setprice
  );
  return result;
};

exports.acceptInvitationByAdmin = async (
  id,
  participantAddress,
  adminAddress,
  adminPk
) => {
  const roundContract = await getRoundContract(id);
  const roundContractAddress = roundContract._address;
  const acceptContractByAdmin = await roundContract.methods
    .acceptInvitationByAdmin(participantAddress)
    .encodeABI();
  const setprice = await roundContract.methods
    .acceptInvitationByAdmin(participantAddress)
    .estimateGas({ from: adminAddress });
  const result = await makeTransaction(
    acceptContractByAdmin,
    adminAddress,
    adminPk,
    roundContractAddress,
    -1,
    setprice
  );
  return result;
};

exports.rejectInvitationByAdmin = async (id, participantAddress) => {
  const roundContract = await getRoundContract(id);
  const roundContractAddress = roundContract._address;
  const rejectContractByAdmin = await roundContract.methods
    .rejectInvitationByAdmin(participantAddress)
    .encodeABI();
  const setprice = await roundContract.methods
    .rejectInvitationByAdmin(participantAddress)
    .estimateGas({ from: RONDA_CONTRACT_OWNER });
  const result = await makeTransaction(
    rejectContractByAdmin,
    RONDA_CONTRACT_OWNER,
    RONDA_CONTRACT_OWNER_PK,
    roundContractAddress,
    -1,
    setprice
  );
  return result;
};

exports.start = async (id, adminAddress, adminPk) => {
  const roundContract = await getRoundContract(id);
  const roundContractAddress = roundContract._address;
  const start = await roundContract.methods.start().encodeABI();
  const setprice = await roundContract.methods
    .start()
    .estimateGas({ from: adminAddress });
  const result = await makeTransaction(
    start,
    adminAddress,
    adminPk,
    roundContractAddress,
    -1,
    setprice
  );
  return result;
};

exports.makePayment = async (roundId, amount, payerAddress, payerPk) => {
  const roundContract = await getRoundContract(roundId);
  const roundContractAddress = roundContract._address;
  const abiData = await roundContract.methods.makePayment(amount).encodeABI();
  const gasLimit = await roundContract.methods
    .makePayment(amount)
    .estimateGas({ from: payerAddress });
  const result = await makeTransaction(
    abiData,
    payerAddress,
    payerPk,
    roundContractAddress,
    -1,
    gasLimit
  );
  return result;
};

exports.replaceParticipant = async (
  roundId,
  oldParticipantAddress,
  newParticipantAddress,
  adminAddress,
  adminPk
) => {
  const roundContract = await getRoundContract(roundId);
  const roundContractAddress = roundContract._address;
  const abiData = await roundContract.methods
    .replaceParticipant(oldParticipantAddress, newParticipantAddress)
    .encodeABI();
  const gasLimit = await roundContract.methods
    .replaceParticipant(oldParticipantAddress, newParticipantAddress)
    .estimateGas({ from: adminAddress });
  const result = await makeTransaction(
    abiData,
    adminAddress,
    adminPk,
    roundContractAddress,
    -1,
    gasLimit
  );

  return result;
};

const updateLastBalance = async addr => {
  const cipheredAddress = cryptoUtil.cipher(addr);
  const user = await userManager.byWalletAddress(cipheredAddress);
  if (user) {
    try {
      const balance = await web3.eth.getBalance(addr);
      if (balance) {
        user.lastBalance = web3.utils.fromWei(balance);
        await user.save();
      }
    } catch (error) {
      return null;
    }
  }
};

const makeTransaction = async (
  contractAbi,
  ownerAddress,
  ownerPk,
  instanceAddress,
  exTc = -1,
  setprice
) => {
  // TODO: Hay que parametrizar todo esto
  const transactionCount = await web3.eth.getTransactionCount(ownerAddress);
  const transaction = {
    nonce: web3.utils.toHex(exTc > 0 ? exTc : transactionCount),
    gasPrice: GAS_PRICE_HEX,
    gasLimit: web3.utils.toHex(setprice),
    to: instanceAddress,
    value: "0x00",
    data: contractAbi,
    chainId: CHAIN_ID,
  };
  const signedTransaction = await web3.eth.accounts.signTransaction(
    transaction,
    ownerPk
  );
  const result = await web3.eth.sendSignedTransaction(
    signedTransaction.rawTransaction
  );
  // Update last Balance
  try {
    updateLastBalance(ownerAddress);
  } catch (error) {
    console.log(error);
  }
  console.log("Result Transaction: ", result);
  return result;
};

exports.getTransactionCount = async address => {
  return await web3.eth.getTransactionCount(address);
};

exports.sendManyBalanceTx = async (from, fromPk, addresses, amount) => {
  const results = [];
  // Failsafe to bail out of infinite errors
  const maxTransactions = addresses.length;
  let counter = 0;
  for (const addr of addresses) {
    try {
      const nonce = await web3.eth.getTransactionCount(from);
      counter += 1;
      if (counter > maxTransactions + 1) break;
      console.log("Processing filling of nonce: ", nonce);
      const txToSign = {
        nonce,
        from,
        to: addr,
        gas: "21000",
        value: amount,
        gasPrice: GAS_PRICE_HEX,
        chainId: CHAIN_ID,
      };
      const transactionSigned = await web3.eth.accounts.signTransaction(
        txToSign,
        fromPk
      );
      const { rawTransaction } = transactionSigned;
      const result = await web3.eth.sendSignedTransaction(rawTransaction);
      if (result) {
        results.push({ error: null, success: true, address: addr });
      } else {
        throw new Error("Missed timing!");
      }
    } catch (error) {
      results.push[{ error, success: false }];
    }
  }

  return results;
};

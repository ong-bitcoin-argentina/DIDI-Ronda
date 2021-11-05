/* eslint-env node, mocha */
import BN from "bn.js";
import {
  NewRonda,
  RondasRegistryInstance,
  FinishedRonda
} from "./../types/truffle-contracts/RondasRegistry.d";
const RondasRegistry = artifacts.require("RondasRegistry");
const { expectEvent } = require("@openzeppelin/test-helpers");

require("chai")
  .use(require("chai-as-promised"))
  .should();

const addr0x0 = "0x0000000000000000000000000000000000000000";

const assertEqualBN = (bn1: BN, bn2: BN) => assert.isTrue(bn1.eq(bn2));

contract("RondasRegistry", ([_owner, admin]) => {
  let rondasRegistry: RondasRegistryInstance;

  before(async () => {
    rondasRegistry = await RondasRegistry.deployed();
  });

  const RONDA_ID = "1";
  const INVALID_RONDA_ID = "invalidId";

  it("Should create a new ronda", async () => {
    const created = await rondasRegistry.newRonda(RONDA_ID, admin);
    const eventData: NewRonda = {
      name: "NewRonda",
      args: {
        _admin: admin,
        _id: RONDA_ID,
        0: admin,
        1: RONDA_ID
      }
    };
    expectEvent(created.receipt, eventData.name, eventData.args);
  });

  it("Should get a ronda by id", async () => {
    const { 0: id, 1: address, 2: active } = await rondasRegistry.getRondaById(
      RONDA_ID
    );
    assert.equal(id, RONDA_ID);
    assert.notEqual(address, "");
    assert.notEqual(address, addr0x0);
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.equal(active, true);
  });

  it("Should return invalid data on non existent id", async () => {
    const { 0: id, 1: address, 2: active } = await rondasRegistry.getRondaById(
      INVALID_RONDA_ID
    );
    assert.equal(id, "");
    assert.equal(address, addr0x0);
    assert.equal(active, false);
  });

  it("Should return true on existent ronda id", async () => {
    const rondaExists = await rondasRegistry.rondaExists(RONDA_ID);
    assert.equal(rondaExists, true);
  });

  it("Should return false on non existent rond id", async () => {
    const rondaExists = await rondasRegistry.rondaExists(INVALID_RONDA_ID);
    assert.equal(rondaExists, false);
  });

  it("Should be able to finish a Round", async () => {
    const RONDA_ID_NEW = "2";
    await rondasRegistry.newRonda(RONDA_ID_NEW, admin);
    const rondaExists = await rondasRegistry.rondaExists(RONDA_ID_NEW);
    assert.equal(rondaExists, true);
    const finished = await rondasRegistry.finishRonda(RONDA_ID_NEW);
    const {
      0: rondaId,
      1: rondaInfo,
      2: isRondaActive,
      3: finishTime
    } = await rondasRegistry.getRondaById(RONDA_ID_NEW);
    assert.equal(rondaId, RONDA_ID_NEW);
    assert.isFalse(isRondaActive);
    const blockNumber = await web3.eth.getBlockNumber();
    assertEqualBN(new BN(blockNumber), finishTime);

    const eventData: FinishedRonda = {
      name: "FinishedRonda",
      args: {
        _id: RONDA_ID_NEW,
        _finishedTime: new BN(finished.receipt.blockNumber),
        0: RONDA_ID_NEW,
        1: new BN(finished.receipt.blockNumber)
      }
    };

    expectEvent(finished.receipt, eventData.name, eventData.args);
  });
});

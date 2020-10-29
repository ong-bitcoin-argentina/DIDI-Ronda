/* eslint-env node, mocha */
const RondasRegistry = artifacts.require('RondasRegistry');
// const { expectEvent } = require('@openzeppelin/test-helpers');

require('chai')
  .use(require('chai-as-promised'))
  .should();

// eslint-disable-next-line no-unused-vars
contract('RondasRegistry', ([owner, admin, ...accounts]) => {
  let rondasRegistry;

  before(async () => {
    rondasRegistry = await RondasRegistry.deployed();
  });

  describe('Rondas Registry', async () => {
    const RONDA_ID = '1';
    const INVALID_RONDA_ID = 'invalidId';
    it('Should create a new ronda', async () => {
      await rondasRegistry.newRonda(RONDA_ID, admin);
    });
    it('Should get a ronda by id', async () => {
      const { 0: id, 1: address, 2: active } = await rondasRegistry.getRondaById(RONDA_ID);
      assert.equal(id, RONDA_ID);
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.equal(active, true);
    });
    it('Should return invalid data on non existent id', async () => {
      const { 0: id, 1: address, 2: active } = await rondasRegistry.getRondaById(INVALID_RONDA_ID);
      assert.equal(id, '');
      assert.equal(address, 0x0);
      assert.equal(active, false);
    });
    it('Should return true on existent ronda id', async () => {
      const rondaExists = await rondasRegistry.rondaExists(RONDA_ID);
      assert.equal(rondaExists, true);
    });
    it('Should return false on non existent rond id', async () => {
      const rondaExists = await rondasRegistry.rondaExists(INVALID_RONDA_ID);
      assert.equal(rondaExists, false);
    });
  });
});

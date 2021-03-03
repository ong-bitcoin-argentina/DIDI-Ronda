/* eslint-env node, mocha */
const RondasRegistry = artifacts.require('RondasRegistry');

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('RondasRegistry', () => {
  let rondasRegistry;

  before(async () => {
    rondasRegistry = await RondasRegistry.deployed();
  });

  it('Deploys RondasRegistry successfully', async () => {
    const { address } = rondasRegistry;
    assert.notEqual(address, '');
    assert.notEqual(address, 0x0);
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
});

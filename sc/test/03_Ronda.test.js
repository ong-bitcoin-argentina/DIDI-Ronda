/* eslint-disable no-plusplus */
/* eslint-env node, mocha */
const RondasRegistry = artifacts.require('RondasRegistry');
const Ronda = artifacts.require('Ronda');
const { expectRevert } = require('@openzeppelin/test-helpers');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const getNewRonda = async (rondasRegistry, admin, id) => {
  await rondasRegistry.newRonda(id, admin);
  const { 1: address } = await rondasRegistry.getRondaById(id);
  assert.notEqual(address, 0x0);

  const rondaExists = await rondasRegistry.rondaExists(id);
  assert.equal(rondaExists, true);
  return Ronda.at(address);
};

const PENDING = 0;
const ACCEPTED = 1;
const REJECTED = 2;

// eslint-disable-next-line no-unused-vars
contract('Ronda', ([owner, admin, other, ...participants]) => {
  let rondasRegistry;
  let ronda;
  let rondaId = 0;

  before(async () => {
    rondasRegistry = await RondasRegistry.deployed();
  });

  beforeEach(async () => {
    rondaId++;
    ronda = await getNewRonda(rondasRegistry, admin, `${rondaId}`);
  });

  it('Expect isAdmin to be true using admin account', async () => {
    const isAdmin = await ronda.isAdmin({ from: admin });
    assert.equal(isAdmin, true);
  });

  it('Expect isAdmin to be false using a non admin account', async () => {
    const isAdmin = await ronda.isAdmin({ from: other });
    assert.equal(isAdmin, false);
  });
  it('Get Participant should return 0x0', async () => {
    const {
      0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
    } = await ronda.getParticipant(participants[0], { from: admin });
    assert.equal(participantAddress, 0x0);
    assert.equal(acceptedMoment, 0);
    assert.equal(state, PENDING);
    assert.equal(number, 0);
    assert.equal(madeBy, 0x0);
    assert.equal(exists, false);
  });
  it('Add participant in pending state', async () => {
    await ronda.addParticipant(participants[0], { from: admin });
    const {
      0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
    } = await ronda.getParticipant(participants[0], { from: admin });

    assert.equal(participantAddress, participants[0]);
    assert.equal(acceptedMoment, 0);
    assert.equal(state, PENDING);
    assert.equal(number, 0);
    assert.equal(madeBy, 0);
    assert.equal(exists, true);
  });
  it('Add participant. Expect to fail for same address', async () => {
    await ronda.addParticipant(participants[0], { from: admin });
    await expectRevert(ronda.addParticipant(participants[0], { from: admin }),
      'The participant is already present on the round');
  });

  it('Add participants', async () => {
    await ronda.addParticipants(participants, { from: admin });

    participants.forEach(async (address) => {
      const participantExists = await ronda.participantExists(address, { from: admin });
      assert.equal(participantExists, true);

      const participantIsPending = await ronda
        .participantStateIsPending(address, { from: admin });
      assert.equal(participantIsPending, true);

      const {
        0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
      } = await ronda.getParticipant(address, { from: admin });

      assert.equal(address, participantAddress);
      assert.equal(acceptedMoment, 0);
      assert.equal(state, PENDING);
      assert.equal(number, 0);
      assert.equal(madeBy, 0);
      assert.equal(exists, true);
    });
  });

  it('Add participants. Should not fail for duplicated address', async () => {
    await ronda.addParticipants([...participants, participants[0]], { from: admin });

    participants.forEach(async (address) => {
      const participantExists = await ronda.participantExists(address, { from: admin });
      assert.equal(participantExists, true);

      const participantIsPending = await ronda
        .participantStateIsPending(address, { from: admin });
      assert.equal(participantIsPending, true);

      const {
        0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
      } = await ronda.getParticipant(address, { from: admin });

      assert.equal(address, participantAddress);
      assert.equal(acceptedMoment, 0);
      assert.equal(state, PENDING);
      assert.equal(number, 0);
      assert.equal(madeBy, 0);
      assert.equal(exists, true);
    });
  });

  it('Add participants. Should not fail for duplicated address', async () => {
    await ronda.addParticipants([...participants, participants[0]], { from: admin });

    participants.forEach(async (address) => {
      const participantExists = await ronda.participantExists(address, { from: admin });
      assert.equal(participantExists, true);

      const participantIsPending = await ronda
        .participantStateIsPending(address, { from: admin });
      assert.equal(participantIsPending, true);

      const {
        0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
      } = await ronda.getParticipant(address, { from: admin });

      assert.equal(address, participantAddress);
      assert.equal(acceptedMoment, 0);
      assert.equal(state, PENDING);
      assert.equal(number, 0);
      assert.equal(madeBy, 0);
      assert.equal(exists, true);
    });
  });

  it('Participant accepts invitation', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.acceptInvitationToParticipate({ from: participant });

    const {
      0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
    } = await ronda.getParticipant(participant, { from: admin });

    assert.equal(participantAddress, participant);
    assert.notEqual(acceptedMoment, 0);
    assert.equal(state, ACCEPTED);
    assert.equal(number, 0);
    assert.equal(madeBy, participant);
    assert.equal(exists, true);
  });

  it('Participant should exist before accept', async () => {
    const participant = participants[0];
    await expectRevert(
      ronda.acceptInvitationToParticipate({ from: participant }),
      'The participant doesn\'t exists',
    );
  });

  it('Participant should not accept invitation more than one time', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.acceptInvitationToParticipate({ from: participant });
    await expectRevert(
      ronda.acceptInvitationToParticipate({ from: participant }),
      'The participant state must be pending',
    );
  });

  it('Participant reject invitation', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.rejectInvitationToParticipate({ from: participant });

    const {
      0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
    } = await ronda.getParticipant(participant, { from: admin });

    assert.equal(participantAddress, participant);
    assert.notEqual(acceptedMoment, 0);
    assert.equal(state, REJECTED);
    assert.equal(number, 0);
    assert.equal(madeBy, participant);
    assert.equal(exists, true);
  });

  it('Participant should exist before reject', async () => {
    const participant = participants[0];
    await expectRevert(
      ronda.rejectInvitationToParticipate({ from: participant }),
      'The participant doesn\'t exists',
    );
  });

  it('Participant should not reject invitation more than one time', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.rejectInvitationToParticipate({ from: participant });
    await expectRevert(
      ronda.rejectInvitationToParticipate({ from: participant }),
      'The participant state must be pending',
    );
  });

  it('Participant accepts invitation by admin', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.acceptInvitationByAdmin(participant, { from: admin });

    const {
      0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
    } = await ronda.getParticipant(participant, { from: admin });

    assert.equal(participantAddress, participant);
    assert.notEqual(acceptedMoment, 0);
    assert.equal(state, ACCEPTED);
    assert.equal(number, 0);
    assert.equal(madeBy, admin);
    assert.equal(exists, true);
  });

  it('Participant should exist before accept by admin', async () => {
    const participant = participants[0];
    await expectRevert(
      ronda.acceptInvitationByAdmin(participant, { from: admin }),
      'The participant doesn\'t exists',
    );
  });

  it('Participant should not accept by admin more than one time', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.acceptInvitationByAdmin(participant, { from: admin });
    await expectRevert(
      ronda.acceptInvitationByAdmin(participant, { from: admin }),
      'The participant state must be pending',
    );
  });

  it('Participant reject invitation by admin', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.rejectInvitationByAdmin(participant, { from: admin });

    const {
      0: participantAddress, 1: acceptedMoment, 2: state, 3: number, 4: madeBy, 5: exists,
    } = await ronda.getParticipant(participant, { from: admin });

    assert.equal(participantAddress, participant);
    assert.notEqual(acceptedMoment, 0);
    assert.equal(state, REJECTED);
    assert.equal(number, 0);
    assert.equal(madeBy, admin);
    assert.equal(exists, true);
  });

  it('Participant should exist before reject by admin', async () => {
    const participant = participants[0];
    await expectRevert(
      ronda.rejectInvitationByAdmin(participant, { from: admin }),
      'The participant doesn\'t exists',
    );
  });

  it('Participant should not reject by admin more than one time', async () => {
    const participant = participants[0];
    await ronda.addParticipant(participant, { from: admin });

    await ronda.rejectInvitationByAdmin(participant, { from: admin });
    await expectRevert(
      ronda.rejectInvitationByAdmin(participant, { from: admin }),
      'The participant state must be pending',
    );
  });
});

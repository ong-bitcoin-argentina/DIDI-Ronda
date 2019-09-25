import api_call from './helper';

// Login
export const login = async () => {
  try {
    return await api_call('post', '/login', '', {
      username: 'user@test.com',
      password: 'user@test.com',
    });
  } catch (error) {
    return {error};
  }
};

// Get round list of user
export const getRoundsList = async () => {
  try {
    return await api_call('get', '/user/round');
  } catch (error) {
    return {error};
  }
};

// Create round
export const createRound = async (amount, config, name, participants, date, confirmationDate, paymentDate) => {
  const participantsList = participants.map(contact => {
    let res = {phone: contact.phoneNumbers[0].number, name: contact.givenName};
    if (contact.number) {
      res['number'] = contact.number;
    }
    return res;
  });
  try {
    return await api_call('post', '/user/round', {
      name: name,
      amount: parseInt(amount),
      recurrence: config.frequency,
      limitDate: confirmationDate,
      startDate: date,
      firstPaymentDate: paymentDate,
      shifts: parseInt(config.participantsQty),
      participants: participantsList,
    });
  } catch (error) {
    return {error};
  }
};

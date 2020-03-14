import api_call from './helper';

// Login
export const login = async (username, password) => {
  try {
    return await api_call('post', '/login', {
      username,
      password,
    });
  } catch (error) {
    return {error};
  }
};

// Register
export const register = async (username, password, name, token) => {
  try {
    return await api_call('post',
     '/register', 
      { username,
        password,
        name,
        token }
    );
  } catch (error) {
    return {error};
  }
};

// Verify
export const verifyEmail = async (username, token) => {
  try {
    return await api_call('post',
     '/verify', 
      { 
        username: username,
        token: token,
      }
    );
  } catch (error) {
    return {error};
  }
};

// Forgot
export const forgot = async (username) => {
  try {
    return await api_call('post',
     '/forgot', 
      { 
        username: username,
      }
    );
  } catch (error) {
    return {error};
  }
};

// Forgot code
export const forgotCode = async (username, token) => {
  try {
    return await api_call('post',
     '/forgot/code', 
      { 
        username: username,
        token: token
      }
    );
  } catch (error) {
    return {error};
  }
};
// Forgot ser new password
export const forgotNewPassword = async (username, password, token) => {
  try {
    return await api_call('post',
     '/forgot/password', 
      { 
        username: username,
        password: password,
        token: token
      }
    );
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
    let phone;
    let name;
    if(contact.phantom){
      name = contact.user.name
      phone =  Math.floor(Math.random() * 1000000) + 1000000;
    
    }else{ 
      phone = contact.phoneNumbers[0].number;
      name = contact.givenName;
    }

    let res = { phone, name , phantom: contact.phantom || false };

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

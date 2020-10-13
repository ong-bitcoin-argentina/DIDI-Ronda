import apiCall from './helper';
import { getPaymentDate } from '../../utils/dates';

// Login
export const login = async (username, password) => {
  try {
    return await apiCall('post', '/login', {
      username,
      password,
    });
  } catch (error) {
    return { error };
  }
};

// loginWithAidi
export const loginWithAidi = async token => {
  console.log('sending request.... loginWithAidi');
  console.log(token);
  try {
    return await apiCall('post', '/login/aidi', {
      token,
    });
  } catch (error) {
    console.log('error loginWithAidi', error);
    return { error };
  }
};

// Register
export const register = async (username, password, name, token, nick) => {
  try {
    return await apiCall('post', '/register', {
      username,
      password,
      name,
      token,
      nick,
    });
  } catch (error) {
    return { error };
  }
};

// Verify
export const verifyEmail = async (username, token) => {
  try {
    return await apiCall('post', '/verify', {
      username,
      token,
    });
  } catch (error) {
    return { error };
  }
};

// Forgot
export const forgot = async username => {
  try {
    return await apiCall('post', '/forgot', {
      username,
    });
  } catch (error) {
    return { error };
  }
};

// Forgot code
export const forgotCode = async (username, token) => {
  try {
    return await apiCall('post', '/forgot/code', {
      username,
      token,
    });
  } catch (error) {
    return { error };
  }
};
// Forgot ser new password
export const forgotNewPassword = async (username, password, token) => {
  try {
    return await apiCall('post', '/forgot/password', {
      username,
      password,
      token,
    });
  } catch (error) {
    return { error };
  }
};

// Get round list of user
export const getRoundsList = async () => {
  try {
    return await apiCall('get', '/user/round');
  } catch (error) {
    return { error };
  }
};

// Create round
export const createRound = async (
  amount,
  frequency,
  roundName,
  participants,
  date,
) => {
  const participantsObj = {};
  participants.forEach(contact => {
    const { name, phone, phantom, number } = contact;
    const res = {
      name,
      phone,
      shiftsQty: 1,
      number: [number],
      phantom: phantom || false,
    };

    if (participantsObj[phone]) {
      participantsObj[phone] = {
        ...participantsObj[phone],
        number: [...participantsObj[phone].number, number],
        shiftsQty: participantsObj[phone].shiftsQty + 1,
      };
      return;
    }
    participantsObj[phone] = res;
  });
  const participantsList = Object.values(participantsObj);
  let shifts = 0;
  participantsList.forEach(p => {
    shifts += p.shiftsQty;
  });
  const { date: paymentDate } = getPaymentDate(date, frequency, 1);
  try {
    const data = await apiCall('post', '/user/round', {
      name: roundName,
      amount: parseInt(amount, 10),
      shifts,
      recurrence: frequency,
      limitDate: date,
      startDate: date,
      firstPaymentDate: paymentDate.toISOString(),
      participants: participantsList,
    });

    return data;
  } catch (error) {
    return { error };
  }
};

export const updateRound = async data => {
  try {
    const url = `/admin/round/${data.id}`;
    await apiCall('put', url, data);
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};

export const phone = async (username, phoneData, country) => {
  const body = { username, phone: phoneData, country };

  try {
    return await apiCall('post', '/phone', body);
  } catch (error) {
    return { error };
  }
};

export const phoneVerify = async (username, phoneData, country, code) => {
  const body = { username, phone: phoneData, country, token: code };

  try {
    return await apiCall('post', '/phone/code', body);
  } catch (error) {
    return { error };
  }
};

export const getUserData = async () => {
  try {
    return await apiCall('post', '/user/userData');
  } catch (error) {
    return { error };
  }
};

// Update token
export const updateToken = async token => {
  try {
    return await apiCall('post', '/user/token/update', {
      newToken: token,
    });
  } catch (error) {
    return { error };
  }
};

// Get notifications list of user
export const getNotifications = async username => {
  try {
    return await apiCall('post', '/user/notifications', { username });
  } catch (error) {
    return { error };
  }
};

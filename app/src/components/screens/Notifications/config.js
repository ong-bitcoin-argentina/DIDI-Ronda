import colors from '../../components/colors';

const { green, mainBlue, red, statusPurple } = colors;

const icons = {
  round: 'filter-tilt-shift',
  participant: 'person',
  admin: 'security',
  payment: 'attach-money',
  default: 'error-outline',
};

const castIcon = key => {
  switch (true) {
    case key.includes('round') || key.includes('shift'):
      return icons.round;
    case key.includes('participant'):
      return icons.participant;
    case key.includes('pay'):
      return icons.payment;
    case key.includes('user'):
      return icons.participant;
    case key.includes('admin'):
      return icons.admin;
    case key.includes('number'):
      return icons.payment;
    default:
      return icons.default;
  }
};

let config = {
  'participant-confirmed': {
    color: green,
  },
  'shift-requested': {
    color: statusPurple,
  },
  'round-invite': {
    color: statusPurple,
  },
  'round-started': {
    color: mainBlue,
  },
  'shift-assigned': {
    color: mainBlue,
  },
  'round-completed': {
    color: mainBlue,
  },
  'participant-pay-number': {
    color: green,
  },
  'participant-request-payment': {
    color: statusPurple,
  },
  'participant-request-admin-accept-payment': {
    color: statusPurple,
  },
  'participant-rejected': {
    color: red,
  },
  'participant-swapped': {
    color: red,
  },
  'round-not-started-participant-rejected': {
    color: red,
  },
  'round-confirmation-completed': {
    color: mainBlue,
  },
  'round-confirmation-failed': {
    color: red,
  },
  'round-invitation-completed': {
    color: green,
  },
  'round-invitation-failed': {
    color: red,
  },
  'participant-payment-confirmed': {
    color: green,
  },
  'participant-payment-failed': {
    color: red,
  },
  'admin-swapped-confirmed': {
    color: green,
  },
  'admin-swapped-failed': {
    color: red,
  },
  'round-start-completed': {
    color: mainBlue,
  },
  'round-start-failed': {
    color: red,
  },
  'register-user-completed': {
    color: mainBlue,
  },
  'register-user-failed': {
    color: red,
  },
  'number-payed-to-user': {
    color: green,
  },
  default: {
    color: mainBlue,
  },
};

export const getColor = key => {
  return config[key] ? config[key].color : config.default.color;
};

export const getIcon = key => {
  return castIcon(key);
};

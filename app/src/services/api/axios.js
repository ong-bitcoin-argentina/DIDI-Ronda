import axios from 'axios';
import store from '../../store/store';

const client = axios.create({
  baseURL: 'http://165.227.94.254:3030',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    origin: 'APP',
    api_key: '123456',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJAdGVzdC5jb20ifQ.c9i-82vqIMQtgzLG1t6Q_57CzC2knFXBM7r_5YOInaE',
  },
});
export const setToken = token => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
export default client;

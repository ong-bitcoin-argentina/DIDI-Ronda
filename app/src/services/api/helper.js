import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Config from "react-native-config";
import { getToken, logOut } from '../../components/utils';

const { API_URL, API_PORT, API_KEY } = Config

export default api_call = async (method, url, requestParams = {}) => {
  try {
    const token = await getToken();

    // TODO:
    // If api call authorization fail, redirect login

    //Needs refactor!
    const client = axios.create({
      baseURL: `${API_URL}:${API_PORT}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        origin: 'APP',
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log('REQUEST PARAMS', requestParams)
    const res = await client[method](url, requestParams);
    console.log(`RESPONSE ${method} ${url}`, res);
    return res;
  } catch (error) {
    if( error.response.status === 401 ){
      logOut();
      throw error;
    } else {
      throw error;
    }
  }
};

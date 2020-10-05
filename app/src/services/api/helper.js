import axios from "axios";
import Config from "react-native-config";
import { getToken } from "../../utils/utils";

const { API_URL, API_PORT, API_KEY, STG } = Config;

const apiCall = async (method, url, requestParams = {}) => {
  try {
    const token = await getToken();
    
    let baseURL = `${API_URL}:${API_PORT}`;
    if (STG) baseURL = `${API_URL}`    

    // TODO:
    // If api call authorization fail, redirect login

    // Needs refactor!
    const client = axios.create({
      baseURL: baseURL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        origin: "APP",
        api_key: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    const res = await client[method](url, requestParams);
    return res;
  } catch (error) {
    if (error.response.status === 401) {
      // TODO: logout on 401
      // logOut();
      throw error;
    } else {
      throw error;
    }
  }
};

export default apiCall;

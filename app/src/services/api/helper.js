import client from './axios';

export default api_call = async (method, url, requestParams = {}) => {
  try {
    const res = await client[method](url, requestParams);
    console.log(`RESPONSE ${method} ${url}`, res);
    return res;
  } catch (error) {
    throw error;
  }
};

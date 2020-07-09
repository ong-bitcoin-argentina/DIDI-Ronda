import AsyncStorage from "@react-native-community/async-storage";

export const getItem = async key => JSON.parse(await AsyncStorage.getItem(key));

export const deleteItem = async key => AsyncStorage.removeItem(key);

export const saveItem = async (key, data) =>
  AsyncStorage.setItem(key, JSON.stringify(data));

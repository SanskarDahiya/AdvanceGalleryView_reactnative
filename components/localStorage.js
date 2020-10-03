import AsyncStorage from '@react-native-community/async-storage';
export default {
  AllItems: () => AsyncStorage.getAllKeys(),
  getData: key => AsyncStorage.getItem(key),
  removeData: key => AsyncStorage.removeItem(key),
  setData: (key, data) => AsyncStorage.setItem(key, data),
};

import AsyncStorage from '@react-native-community/async-storage';
AsyncStorage.setItem('abcd2', JSON.stringify([{data: '1'}]));
AsyncStorage.setItem('sample', JSON.stringify([{data: '1', a: 2}]));
export default {
  AllItems: () => AsyncStorage.getAllKeys(),
  getData: key => AsyncStorage.getItem(key),
  setData: (key, data) => AsyncStorage.setItem(key, data),
};

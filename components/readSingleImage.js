var RNFS = require("react-native-fs");

const Convert = async path => {
  try {
    // let data = await RNFS.stat(path);
    let data = await RNFS.readFile(path, "base64");
    // console.log(data, '111');
    // console.log(data.slice(0, 50), '111');
    return `data:image/jpg;base64,${data}`;
  } catch (err) {
    return path;
  }
};
export default Convert;

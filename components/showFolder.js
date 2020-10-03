import React, {Component} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  BackHandler,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import storage from './localStorage';
import DialogInput from 'react-native-dialog-input';
import {Actions} from 'react-native-router-flux';
let {width, height} = Dimensions.get('window');

class App extends Component {
  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(100);

    this.state = {
      openDialog: false,
      openDialog_delete: false,
      folderData: [],
      folderNames: [],
      inputBoxData: {
        title: 'CREATE FOLDER',
        message: '',
        hintInput: 'Enter Name',
      },
    };
  }
  handleBackButton = () => {
    this.state.backClickCount == 1 ? BackHandler.exitApp() : this._spring();

    return true;
  };
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButton.bind(this),
    );
  }
  componentDidMount() {
    this.updateState();
    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButton.bind(this),
    // );
  }

  _spring() {
    console.log('spring');
    this.setState({backClickCount: 1}, () => {
      Animated.sequence([
        Animated.spring(this.springValue, {
          toValue: -0.15 * height,
          friction: 5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(this.springValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        this.setState({backClickCount: 0});
      });
    });
  }

  updateState = async () => {
    try {
      let folderData = {};
      const folderNames = await storage.AllItems();
      for (let folder of folderNames) {
        let data = await storage.getData(folder);
        data = JSON.parse(data);
        folderData[folder] = data;
      }
      this.setState({folderData, folderNames});
    } catch (err) {
      Alert.alert(
        'Please, restart the app',
        '',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };
  // openDialog_delete
  render() {
    const {
      folderData,
      folderNames,
      openDialog_delete,
      openDialog,
      inputBoxData,
    } = this.state;
    return (
      <View style={styles.app}>
        <DialogInput
          isDialogVisible={openDialog}
          title={inputBoxData.title || ''}
          message={inputBoxData.message || ''}
          hintInput={inputBoxData.hintInput || ''}
          submitInput={inputText => {
            inputText = ((inputText || '').trim() || '').toLowerCase();
            if (!inputText) {
              this.setState({
                openDialog: true,
                inputBoxData: {...inputBoxData, message: 'Please Enter Name'},
              });
            } else if (folderNames.indexOf(inputText) >= 0) {
              this.setState({
                openDialog: true,
                inputBoxData: {
                  ...inputBoxData,
                  message: 'Name Already Present',
                },
              });
            } else {
              this.setState({
                openDialog: false,
                inputBoxData: {...inputBoxData, message: ''},
              });
              storage.setData(inputText, JSON.stringify([])).then(() => {
                console.log('state updates');
                this.updateState();
              });
              // console.log(inputText);
            }
          }}
          closeDialog={() => {
            this.setState({
              openDialog: false,
              inputBoxData: {...inputBoxData, message: ''},
            });
          }}></DialogInput>

        <ScrollView>
          {/* <Text style={[styles.title, {color: 'white'}]}>Ashish Jewellers</Text> */}
          {/* gallery wrapper */}
          {/* <Text style={[styles.text, {}]}>Category</Text> */}
          <View
            style={[
              styles.header,
              {
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                width: '100%',
                borderWidth: 2,
                //borderColor: "pink"
              },
            ]}>
            {folderNames && folderNames.length ? (
              folderNames.map(name => {
                let image = folderData[name][0];
                image =
                  (image && image.uri) ||
                  'https://i.pinimg.com/originals/a6/f0/89/a6f089c3ad682858d8d9626d12d6c9a6.jpg';
                return (
                  // each image wrapper
                  <Pressable
                    key={name}
                    onLongPress={() => {
                      console.log('long press');
                      Alert.alert(
                        'Delete folder:' + name,
                        '',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => {
                              console.log('Cancel Pressed');
                            },
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              storage.removeData(name).then(() => {
                                this.updateState();
                              });
                              console.log('OK Pressed');
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }}
                    onPress={() => {
                      console.log('presses', name);
                      Actions.images({
                        folderName: name,
                        images: folderData[name] || [],
                        update: this.updateState,
                      });
                    }}
                    style={{
                      borderWidth: 1,
                      //borderColor: "white",
                      flexGrow: 1, // to fill last part, if require
                      width: '50%',
                      position: 'relative',
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                    }}>
                    <View>
                      <Image
                        source={{uri: image}}
                        resizeMode="contain"
                        style={[
                          styles.logo,
                          {
                            // here
                          },
                        ]}
                      />
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        textAlign: 'center',
                        backgroundColor: 'black',
                        opacity: 0.4,
                      }}>
                      <Text style={{color: 'white', fontSize: 14}}>{name}</Text>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <Text
                style={{
                  color: 'white',
                }}>
                Use Bottom Button To Create Folder
              </Text>
            )}
          </View>
        </ScrollView>
        <Button
          title={'Add New Folder'}
          style={{backgroundColor: 'white'}}
          onPress={() => {
            this.setState({openDialog: true});
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  logo: {
    height: 80,
  },
  header: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    color: 'white',
  },
  link: {
    color: '#1B95E0',
  },
  code: {
    fontFamily: 'monospace, monospace',
  },
});

export default App;

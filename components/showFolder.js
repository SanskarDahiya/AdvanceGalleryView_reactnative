import React, {Component} from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import storage from './localStorage';
import DialogInput from 'react-native-dialog-input';
import {Actions} from 'react-native-router-flux';

let sampleData = [];
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
      folderData: [],
      folderNames: [],
      inputBoxData: {
        title: 'CREATE FOLDER',
        message: '',
        hintInput: 'Enter Name',
      },
    };
  }
  componentDidMount() {
    this.updateState();
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
      alert('Please, restart the app');
    }
  };
  render() {
    const {folderData, folderNames, openDialog, inputBoxData} = this.state;
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
          <Text style={[styles.title, {color: 'white'}]}>Ashish Jewellers</Text>
          {/* gallery wrapper */}
          <Text style={[styles.text, {}]}>Category</Text>
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
            {folderNames.map(name => {
              let image = folderData[name][0];
              image =
                (image && image.uri) ||
                'https://i.pinimg.com/originals/a6/f0/89/a6f089c3ad682858d8d9626d12d6c9a6.jpg';
              return (
                // each image wrapper
                <Pressable
                  onPress={() => {
                    console.log('presses', name);
                    Actions.about({
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
            })}
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

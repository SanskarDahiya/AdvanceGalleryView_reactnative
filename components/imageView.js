import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {
  Button,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import storage from './localStorage';
import ImageViewerComponents from './renderImage';
import {Actions} from 'react-native-router-flux';
// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Image To Upload',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info in the API Reference)
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      folderName: props.folderName,
      folderData: props.image || [],
    };
  }
  componentDidMount() {
    let {folderName, folderData = []} = this.state;

    storage.getData(folderName).then(res => {
      res = JSON.parse(res);
      this.setState({folderData: res || []});
    });
  }
  chooseImage = () => {
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', Object.keys(response));
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const {data, ...rest} = response;
        console.log({
          rest,
        });
        console.log('Response = ', Object.keys(response));
        let {folderName, folderData = []} = this.state;
        folderData = [
          ...folderData,
          {
            name: response.fileName,
            image: response.uri,
            path: response.path,
            type: response.type,
          },
        ];
        this.setState({folderData});
        storage.setData(folderName, JSON.stringify(folderData)).then(res => {
          // this.props.update && this.props.update();
        });
        // this.setState({data: response});
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  };
  render() {
    let {folderName, folderData = []} = this.state;
    return (
      <View style={styles.app}>
        <ScrollView>
          {/* gallery wrapper */}
          <Text style={[styles.text, {}]}>{folderName}</Text>
          <View
            style={[
              styles.header,
              {
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: 'row',
                width: '100%',
              },
            ]}>
            {folderData.map((item, index) => {
              const {name} = item;
              return (
                // each image wrapper
                <View
                  key={index}
                  style={{
                    flexGrow: 1, // to fill last part, if require
                    width: '50%',
                    position: 'relative',
                  }}>
                  <Pressable
                    onPress={() => {
                      Actions.singleImage({
                        imageData: item,
                        isSingle: true,
                        style: {
                          height: 'auto',
                          width: 'auto',
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                        },
                      });
                    }}
                    onLongPress={() => {
                      console.log('long press');
                      Alert.alert(
                        '',
                        'Delete Current Image:',
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
                              let {folderData} = this.state;
                              console.log(index);
                              folderData.splice(index, 1);
                              storage
                                .setData(folderName, JSON.stringify(folderData))
                                .then(() => {
                                  this.setState({folderData: [...folderData]});
                                });
                              console.log('OK Pressed');
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    }}>
                    <ImageViewerComponents imageData={item} />
                  </Pressable>

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
                </View>
              );
            })}
          </View>
        </ScrollView>

        <Button
          title={'insert IMage'}
          style={{backgroundColor: 'white'}}
          onPress={this.chooseImage}
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
    height: 200,
    width: '100%',
  },
  header: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
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

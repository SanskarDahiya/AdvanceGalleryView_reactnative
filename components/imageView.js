import React, {Component} from 'react';
import ImagePicker from 'react-native-image-picker';
import {Button, Image, StyleSheet, Text, View, ScrollView} from 'react-native';
import storage from './localStorage';
// More info on all the options is below in the API Reference... just some common use cases shown here
const options = {
  title: 'Select Image To Upload',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
var RNFS = require('react-native-fs');

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info in the API Reference)
 */

let sampleData = [
  {
    name: 'a1',
    image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  },
  {
    name: 'a2',
    image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  },
  {
    name: 'a3',
    image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  },
  {
    name: 'a4',
    image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  },
  {
    name: 'ring',
    image: 'https://homepages.cae.wisc.edu/~ece533/images/airplane.png',
  },
];

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
    ImagePicker.showImagePicker(options, response => {
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
          this.props.update && this.props.update();
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
                borderWidth: 2,
                borderColor: 'pink',
              },
            ]}>
            {[...sampleData, ...folderData].map(item => {
              const {name} = item;
              return (
                // each image wrapper
                <View
                  style={{
                    flexGrow: 1, // to fill last part, if require
                    width: '50%',
                    position: 'relative',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                  }}>
                  <ImageViewer imageData={item} />

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
class ImageViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.imageData,
    };
  }
  async componentDidMount() {
    const {name, image, path, type} = this.state || {};
    if (path) {
      let data = await RNFS.stat(path);
      data = await RNFS.readFile(path, 'base64');
      // console.log(data, '111');
      console.log(data.slice(0, 50), '111');
      this.setState({
        source: {uri: `data:${path || 'image/jpg'};base64,${data}`},
      });
    }
  }
  render() {
    let {image, source} = this.state || {};
    if (!source) {
      source = {uri: image};
    }
    return (
      <View>
        <Image
          source={source}
          resizeMode="contain"
          style={[
            styles.logo,
            {
              // here
            },
          ]}
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

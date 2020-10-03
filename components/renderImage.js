import React, {Component} from 'react';
import {Image, Dimensions} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

var RNFS = require('react-native-fs');

class ImageViewerComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.imageData,
      imageStyles: {
        height: 200,
        width: '100%',
        ...props.style,
      },
    };
  }
  async componentDidMount() {
    const {path} = this.state || {};
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
    let {image, source, imageStyles} = this.state || {};
    if (!source) {
      source = {uri: image};
    }
    if (this.props.isSingle) {
      return (
        <ImageZoom
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={Dimensions.get('window').width}
          imageHeight={Dimensions.get('window').height}>
          <Image source={source} resizeMode="contain" style={imageStyles} />
        </ImageZoom>
      );
    }
    return <Image source={source} resizeMode="contain" style={imageStyles} />;
  }
}

export default ImageViewerComponents;

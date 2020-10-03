import React, { Component } from "react";
import { Image, Dimensions } from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import Convert from "./readSingleImage";

class ImageViewerComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.imageData,
      imageStyles: {
        height: 200,
        width: "100%",
        ...props.style
      }
    };
  }
  async componentDidMount() {
    const { path } = this.state;
    if (path) {
      let data = await Convert(path);
      this.setState({ source: { uri: data } });
    }
  }
  render() {
    let { image, source, imageStyles } = this.state || {};
    if (!source) {
      source = { uri: image };
    }
    if (this.props.isSingle) {
      return (
        <ImageZoom
          cropWidth={Dimensions.get("window").width}
          cropHeight={Dimensions.get("window").height}
          imageWidth={Dimensions.get("window").width}
          imageHeight={Dimensions.get("window").height}
        >
          <Image source={source} resizeMode="contain" style={imageStyles} />
        </ImageZoom>
      );
    }
    return <Image source={source} resizeMode="contain" style={imageStyles} />;
  }
}

export default ImageViewerComponents;

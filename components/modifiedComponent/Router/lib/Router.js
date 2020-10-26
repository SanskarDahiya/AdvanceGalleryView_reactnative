import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
// const sampleData = {
//   routerProps: {},
//   props: {}, // ...RouterProps
//   scenes: [
//     {
//       props: {},
//       scenes: [
//         {
//           props: {},
//         },
//         {},
//       ],
//     },
//   ],
// };
const defaultComponent = () => (
  <View
    style={{
      backgroundColor: 'white',
      paddingVertical: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>NO COMPONENT GIVEN</Text>
  </View>
);
class ModifiedRouter extends Component {
  constructor(props) {
    super(props);
  }

  getScene = (props, children = []) => {
    props.key = props.key || 'key_' + Math.random();
    props.component = props.component || defaultComponent;
    return <Scene {...props}>{children}</Scene>;
  };

  getRouter = (props, children) => {
    props.key = props.key || 'key_' + Math.random();
    return <Router {...props}>{children}</Router>;
  };

  getSceneComponent = (props, scenes = []) => {
    let childComponent = scenes.map(({ props: childProps = {}, scenes: childScenes = [] }) =>
      this.getSceneComponent(childProps, childScenes),
    );
    return this.getScene(props, childComponent);
  };

  render() {
    const { routerProps = {}, props = {}, scenes = [] } = this.props;
    let scenesComponent = this.getSceneComponent(props, scenes);
    let Components = this.getRouter(routerProps, scenesComponent);
    if (Components) {
      return Components;
    }
    console.log('NOTING TO RETURN');
    return (
      <View>
        <Text>INVALID DATA... Unable to create router</Text>
      </View>
    );
  }
}

export default (prop) => <ModifiedRouter {...prop} />;

import React from 'react';
// import { Router, Scene } from 'react-native-router-flux';
import index from './imageView';
import ImageViewerComponents from './renderImage';
import Folder from './showFolder';
import { Router } from './distributer';

//   <Scene
//     key="home"
//     component={Folder}
//     title="ASHISH JEWELLERS"
//     initial={true}
//   />
//   <Scene key="images" component={index} title="IMAGES" />
//   <Scene
//     key="singleImage"
//     component={ImageViewerComponents}
//     title="IMAGE"
//   />
let data = {
  routerProps: {
    sceneStyle: { backgroundColor: 'black' },
    navigationBarStyle: { backgroundColor: 'black', color: 'white' },
    titleStyle: { color: 'white' },
  },
  props: {
    key: 'root',
  }, // ...RouterProps
  scenes: [
    {
      props: { key: 'home', component: Folder, title: 'ASHISH', initial: true },
    },
    {
      props: { key: 'images', component: index, title: 'IMAGES' },
    },
    {
      props: { key: 'singleImage', component: ImageViewerComponents, title: 'IMAGES' },
    },
  ],
};
let data2 = {
  routerProps: {
    sceneStyle: { backgroundColor: 'black' },
    navigationBarStyle: { backgroundColor: 'black', color: 'white' },
    titleStyle: { color: 'white' },
  },
  props: {
    key: 'root',
  }, // ...RouterProps
  scenes: [
    {
      props: { key: 'images2', component: Folder, title: 'IMAGES2' },
    },
  ],
};
const Routes = () => {
  return Router(data);

  return <Router {...data2} />;
  return (
    <Router
      sceneStyle={{ backgroundColor: 'black' }}
      navigationBarStyle={{ backgroundColor: 'black', color: 'white' }}
      titleStyle={{ color: 'white' }}>
      <Scene key="root">
        <Scene {...data} />
        <Scene key="images" component={index} title="IMAGES" />
        <Scene key="singleImage" component={ImageViewerComponents} title="IMAGE" />
      </Scene>
    </Router>
  );
};
export default Routes;

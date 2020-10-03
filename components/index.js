import React from "react";
import { Router, Scene } from "react-native-router-flux";
import index from "./imageView";
import ImageViewerComponents from "./renderImage";
import Folder from "./showFolder";

const Routes = () => (
  <Router
    sceneStyle={{ backgroundColor: "black" }}
    navigationBarStyle={{ backgroundColor: "black", color: "white" }}
    titleStyle={{ color: "white" }}
  >
    <Scene key="root">
      <Scene
        key="home"
        component={Folder}
        title="ASHISH JEWELLERS"
        initial={true}
      />
      <Scene key="images" component={index} title="IMAGES" />
      <Scene
        key="singleImage"
        component={ImageViewerComponents}
        title="IMAGE"
      />
    </Scene>
  </Router>
);
export default Routes;

import React from 'react';
import {Router, Scene} from 'react-native-router-flux';
import index from './imageView';
import Folder from './showFolder';

const Routes = () => (
  <Router>
    <Scene key="root">
      <Scene key="home" component={Folder} title="Home" initial={true} />
      <Scene key="about" component={index} title="About" />
    </Scene>
  </Router>
);
export default Routes;

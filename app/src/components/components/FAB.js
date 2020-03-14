import React, {useState} from 'react';

import {StyleSheet, View, Modal, Image} from 'react-native';
import {Icon, Fab, Text, Button} from 'native-base';
import {getInset} from 'react-native-safe-area-view';
import Colors from './colors.js';
import logo from '../../assets/img/logo.png';


const bottomOffset = getInset('bottom');
const bottomTabNavigationHeight = 49;

const FAB = props => {
  const [active, setActive] = useState(false);

  return(
    <Fab
      active={active}
      direction="up"
      containerStyle={{}}
      style={{backgroundColor: Colors.yellow}}
      position="bottomLeft"
      onPress={() => props.callback()}>
      <Icon name={'add'} />
        
    </Fab>
  );

};

const styles = StyleSheet.create({
  FabButton: {
  },
  textTitle: {
    position: 'absolute',
    color: 'white',
    right: 40,
  },
});

export default FAB;

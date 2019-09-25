import React, {useState} from 'react';

import {StyleSheet, View, Button, Modal, Image} from 'react-native';
import {Icon, Fab, Text} from 'native-base';
import {getInset} from 'react-native-safe-area-view';
import Colors from './colors.js';
import logo from '../../assets/img/logo.png';

const bottomOffset = getInset('bottom');
const bottomTabNavigationHeight = 49;

const FloatingActionButton = props => {
  const [active, setActive] = useState(false);

  const FloatingActionButtonContent = () => (
    <Fab
      active={active}
      direction="up"
      containerStyle={{}}
      style={{backgroundColor: active ? Colors.secondary : Colors.yellow}}
      position="bottomRight"
      onPress={() => setActive(!active)}>
      <Icon name={active ? 'close' : 'add'} />
      {active && (
        <Button
          style={[
            {backgroundColor: Colors.mainBlue},
            styles.FabButton,
            {visible: active},
          ]}>
          <Icon name="md-share" />
          <Text uppercase={false} style={[styles.textTitle]}>
            Pagar número
          </Text>
        </Button>
      )}
      {active && (
        <Button
          style={[
            {backgroundColor: Colors.mainBlue},
            styles.FabButton,
            {visible: active},
          ]}>
          <Icon name="md-share" />
          <Text uppercase={false} style={[styles.textTitle]}>
            Pagar ronda
          </Text>
        </Button>
      )}
      {active && (
        <Button
          style={[
            {backgroundColor: Colors.mainBlue},
            styles.FabButton,
            {visible: active},
          ]}
          onPress={() => {
            props.nav('Create');
            setActive(false);
          }}>
          <Icon
            type="MaterialIcons"
            name="filter-tilt-shift"
          />
          <Text uppercase={false} style={[styles.textTitle]}>
            Armar ronda
          </Text>
        </Button>
      )}
    </Fab>
  );
  return active ? (
    <Modal animationType="fade" transparent={true} visible={active}>
      <View
        onClick={() => setActive(false)}
        style={{
          flex: 1,
          backgroundColor: Colors.overlayTransparent,
          marginBottom: bottomOffset + bottomTabNavigationHeight,
        }}>
        <FloatingActionButtonContent />
      </View>
    </Modal>
  ) : (
    <FloatingActionButtonContent />
  );
};

const styles = StyleSheet.create({
  FabButton: {},
  textTitle: {
    position: 'absolute',
    color: 'white',
    right: 40,
  },
});

export default FloatingActionButton;

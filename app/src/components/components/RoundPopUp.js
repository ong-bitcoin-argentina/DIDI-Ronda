import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Button} from 'native-base';
import Modal from 'react-native-modal';
import colors from './colors';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default class RoundPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: props.visible,
    };
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  _openPopUp() {
    this.setState({isModalVisible: true});
  }
  _closePopUp() {
    if (this.props.onBeforeClose) {
      this.props.onBeforeClose();
    }
    this.setState({isModalVisible: false});
  }
  getButtons() {
    let buttons = [];
    if (this.props.accept) {
      buttons.push(
        <Button
          style={styles.accept}
          onPress={() => {
            this.props.accept();
            this._closePopUp();
          }}>
          <Text style={styles.buttonText}>
            {this.props.acceptTitle || 'OK'}
          </Text>
        </Button>,
      );
    }
    if (this.props.positive) {
      buttons.push(
        <Button
          style={styles.positive}
          onPress={() => {
            this.props.positive();
            this._closePopUp();
          }}>
          <Text style={styles.buttonText}>
            {this.props.positiveTitle || 'Aceptar'}
          </Text>
        </Button>,
      );
    }
    if (this.props.negative) {
      buttons.push(
        <Button
          style={styles.negative}
          onPress={() => {
            this.props.negative();
            this._closePopUp();
          }}>
          <Text style={styles.negativeButtonText}>
            {this.props.negativeTitle || 'Cancelar'}
          </Text>
        </Button>,
      );
    }

    return buttons;
  }
  render() {
    return (
      <View style={{}}>
        <Modal
          isVisible={this.state.isModalVisible}
          style={{height: 300}}
          backdropColor={'rgba(0,0,0,0.5)'}>
          <View style={[styles.container]}>
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.props.icon && this.props.icon}
              {this.props.value != undefined && (
                <Text style={styles.value}>{this.props.value}</Text>
              )}
              <Text style={styles.title}>{this.props.titleText}</Text>
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 60,
                marginVertical: 20
              }}>
              {this.props.children}
            </View>
            <View style={styles.buttonsContainer}>{this.getButtons()}</View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  negative: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  positive: {
    width: '100%',
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  accept: {
    width: '100%',
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 25,
    flexDirection: 'column',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  negativeButtonText: {
    color: colors.secondary,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 18,
    color: colors.gray,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

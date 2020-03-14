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

  _buttons = () => (
    <React.Fragment>
    {
      this.props.accept &&
      <Button
        style={styles.accept}
        onPress={() => {
          this.props.accept();
          !this.props.notCloseAfterPositive && this._closePopUp();
        }}>
        <Text style={styles.buttonText}>
          {this.props.acceptTitle || 'OK'}
        </Text>
      </Button>
    }
    {
      this.props.positive &&
      <Button
        style={styles.positive}
        disabled={this.props.disablePositive || false}
        onPress={() => {
          this.props.positive();
          !this.props.notCloseAfterPositive && this._closePopUp();
        }}>
        <Text style={styles.buttonText}>
          {this.props.positiveTitle || 'Aceptar'}
        </Text>
      </Button>
    }
    {
      this.props.negative &&
      <Button
        style={styles.negative}
        onPress={() => {
          this.props.negative();
          !this.props.notCloseAfterNegative && this._closePopUp();
        }}>
        <Text style={styles.negativeButtonText}>
          {this.props.negativeTitle || 'Cancelar'}
        </Text>
      </Button>
    }
    </React.Fragment>
  )
  
  render() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        backdropColor={'rgba(0,0,0,0.5)'}
      >

        <View style={ styles.container }>

          <View
            style={ styles.titleContainer }>
            {
              this.props.icon && this.props.icon
            }
            {
              this.props.value != undefined && <Text style={ styles.value }>{ this.props.value }</Text>
            }
            <Text style={ styles.title }>
              { this.props.titleText }
            </Text>
          </View>
          
          <View style={ styles.childrenContainer }>
            { this.props.children }
          </View>

          <View style={styles.buttonsContainer}>
            { this._buttons() }
          </View>

        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
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
    marginTop: 10,
  },
  accept: {
    width: '100%',
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
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
  childrenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 60,
    marginVertical: 10,
  }
});

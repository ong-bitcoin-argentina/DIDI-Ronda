import React, {Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import {View, Text, KeyboardAvoidingView, StyleSheet} from 'react-native';
import colors from '../../../components/colors';
import {Input, Form, Item, Button, Toast, Spinner} from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Sae} from 'react-native-textinput-effects';
import * as actions from '../../../../actions/forgot';

const Forgot = (props) => {
  const [email, setEmail] = useState('')


  const validateEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  _sendToken = () => {
    if(  validateEmail() ){
      
      props.sendToken(email)
      props.navigation.navigate('ForgotCode', {username: email})

    }else{ 

      Toast.show({
        text: 'Ingresa un email valido',
        position: 'top',
        type: 'warning',
      })

    }

  }
    return ( 
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>La Ronda</Text>
                <Text style={[styles.subtitle, {width: 350, textAlign : 'center', marginBottom: 30}]}>
                  Ingresa tu email
                </Text>
                <Sae
                label={'Email'}
                value={email}
                onChangeText={setEmail}
                iconClass={FontAwesomeIcon}
                iconName={'user'}
                iconColor={'white'}
                inputPadding={16}
                labelHeight={24}
                borderHeight={2}
                style={{width: '80%'}}
                autoCapitalize={'none'}
                autoCorrect={false}
                labelStyle={{color: 'white'}}
              />
                <Button onPress={_sendToken} style={[styles.button, { width: 200,flexDirection: 'row', justifyContent: 'center'}]}>
                  <Text style={{color: 'black', textAlign: 'center'}}>Enviar</Text>
                </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
        )
};

// define your styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.mainBlue,
    },
    formContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      color: 'white',
    },
    button: {
      marginTop: 30,
      backgroundColor: 'white',
      borderRadius: 8,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 36,
      color: 'white',
      fontWeight: 'bold',
    },
    subtitle: {color: 'white', fontSize: 18},
  });
  
  const mapStateToProps = state => {
    return {
      loading: state.onboarding.loading,
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      sendToken: (username) => {
        dispatch(actions.forgot(username))
      } 
  
    };
  };
export default connect(mapStateToProps, mapDispatchToProps)(Forgot);

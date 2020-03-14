import React, {Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import {View, Text, KeyboardAvoidingView, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../components/colors';
import {Input, Form, Item, Button, Toast, Spinner} from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Sae} from 'react-native-textinput-effects';
import AsyncStorage from '@react-native-community/async-storage';
import * as actions from '../../../actions/onboarding';
import VerifyAccount from './VerifyAccount';
import VerifiedAccount from './Success';

const Register = props => {
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [passwordsStatus, setPasswordStatus] = useState('white');

  useEffect(() => {
    passwordValidation();
  }, [verify]);

  const passwordValidation = () => {
    if (verifyPasswords()) {
      setPasswordStatus('white');
    } else {
      setPasswordStatus(colors.yellow);
    }
  };
  const verifyPasswords = () => {
    return password.trim() !== '' && verify.trim() !== '' &&
                                     password.length > 5  &&
                                     verify.length > 5    &&
                                     password === verify;
  };
  const validateEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  _onChangeName = newName => {
    setName(newName);
  };

  _onChangeEmail = newEmail => {
    setEmail(newEmail);
  };

  _onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };

  _onChangeVerify = newVerify => {
    setVerify(newVerify);
  };


  _goToLogin = () => {
  }

_verifiedAccount = () => {
  props.finish()
  return ( <VerifiedAccount text={"Tu cuenta se creo correctamete"} callback={() => props.navigation.navigate('Login')}/> )
}
  _verifyYourAccount = () => {

    if(props.verified === null){

        return <VerifyAccount sendToken={() => props.validateEmail(email, token)} back={() => props.finish()} title={`Te enviamos un codigo a ${email}`} token={token} setToken={setToken}/>
    
      }else {
      if(props.verified){
        return _verifiedAccount() 
      }else{ 

        Toast.show({
          text: 'El codigo es incorrecto o el email ya fue registrado',
          position: 'top',
          type: 'warning',
        })
        return <VerifyAccount sendToken={() => props.validateEmail(email, token)} back={() => props.finish()} title={`Te enviamos un codigo a ${email}`} token={token} setToken={setToken}/>

      }
    }
  }
  _onRegister = async () => {
    if( password.trim().length < 6 ){
      Toast.show({
        text: 'La contraseña tiene que tener almenos 6 caracteres',
        position: 'top',
        type: 'warning',
      });
      return false
    }
    if (verifyPasswords()) {
      if (!validateEmail() && name.length > 1) {
        Toast.show({
          text: 'Debes utilizar un email valido',
          position: 'top',
          type: 'warning',
        });
      } else {
        const token = await AsyncStorage.getItem('fcmToken');


        props.createUser(email, password, name, token)
      }
    } else {
      Toast.show({
        text: 'Las contraseñas deben ser identicas',
        position: 'top',
        type: 'warning',
      });
    }
  };



  if(props.registrationFinished){
    return _verifyYourAccount()
  }
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      {props.loading ? (
        <Spinner color="white"></Spinner>
      ) : (
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>La Ronda</Text>
            <Text style={styles.subtitle}>Registro</Text>
          </View>
          <Sae
            label={'Nombre'}
            value={name}
            onChangeText={_onChangeName}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'white'}
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{width: '80%'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            labelStyle={{color: 'white'}}
          />
          <Sae
            label={'Email'}
            value={email}
            onChangeText={_onChangeEmail}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={'white'}
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{width: '80%'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            labelStyle={{color: 'white'}}
          />
          <Sae
            label={'Contraseña'}
            onChangeText={_onChangePassword}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={passwordsStatus}
            secureTextEntry={true}
            inputPadding={16}
            labelHeight={24}
            value={password}
            borderHeight={2}
            style={{width: '80%'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            labelStyle={{color: 'white'}}
          />
          <Sae
            label={'Confirmar contraseña'}
            onChangeText={_onChangeVerify}
            iconClass={FontAwesomeIcon}
            iconName={'pencil'}
            iconColor={passwordsStatus}
            secureTextEntry={true}
            value={verify}
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{width: '80%'}}
            autoCapitalize={'none'}
            autoCorrect={false}
            labelStyle={{color: 'white'}}
          />

          <Button onPress={_onRegister} style={styles.button}>
            <Text style={{color: 'black'}}>Registrate</Text>
          </Button>

          <TouchableOpacity onPress={()=> props.navigation.navigate('Login')} style={[styles.button, {backgroundColor: colors.mainBlue, marginTop: 10}]}>
            <Text style={{color: 'white'}}>Volver al inicio de sesion</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

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
    registrationFinished: state.onboarding.registrationFinished,
    verified: state.onboarding.verified
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createUser: (username, password, name, token) => {
      dispatch(actions.createUser(username, password, name, token));
    },
    validateEmail: (username, token) => {
      dispatch(actions.verifyEmail(username, token));
    },
    finish: () => {
      dispatch(actions.finish());
    },

  };
};

export default connect( mapStateToProps, mapDispatchToProps )(Register);

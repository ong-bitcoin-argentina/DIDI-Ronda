import React, { useState } from 'react';
import { connect } from 'react-redux';
import {View, Text, KeyboardAvoidingView, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../components/colors';
import { Button, Toast, Spinner} from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import * as actions from '../../../actions/login';
import {Sae} from 'react-native-textinput-effects';
import Success from './Success';

const Login = props => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  _onChangeEmail = newEmail => {
    setEmail(newEmail);
  };

  _onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };

  _onLogin = () => {
    if (email.trim() != '' && password.trim() != '') {
        props.login(email, password);
        
    } else {
      Toast.show({
        text: 'Usuario o contraseña incorrectos',
        position: 'top',
        type: 'warning',
      });
    }
  };

  _register = () => {
    props.navigation.navigate("Register")
  }

  _forgot = () => {
    props.navigation.navigate('Forgot')
  }
  loginSuccess = () => {
    return (     
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Success text={"Has ingresado correctamente"} callback={() => props.navigation.navigate('Tuto')}/>
          </View>
        </View>
      </KeyboardAvoidingView> 
    )
  }
  _loading = () => (
  <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
            <Spinner color="white"/>
        </View>
      </View>
  </KeyboardAvoidingView>
  )

  let subtitle = "Inicio de sesión";

  if( props.error ){
      subtitle = "Usuario o contraseña incorrectos"
  }else{

    if( props.auth ){
      return loginSuccess()
    }

  }

  if( props.loading ) { return _loading() }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>La Ronda</Text>
            <Text style={styles.subtitle}>{ subtitle }</Text>
          </View>
          <Sae
            label={'Email'}
            value={email}
            onChangeText={_onChangeEmail}
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
          <Sae
            label={'Contraseña'}
            onChangeText={_onChangePassword}
            iconClass={FontAwesomeIcon}
            iconName={'unlock-alt'}
            iconColor={'white'}
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

          <Button onPress={() => _onLogin()} style={styles.button}>
            <Text style={{color: 'black'}}>Iniciar sesión</Text>
          </Button>
          <Button onPress={() => _register()} style={[styles.button, {marginTop: 10}]}>
            <Text style={{color: 'black'}}>Registrate</Text>
          </Button>
          <TouchableOpacity onPress={() => _forgot() } style={[styles.button, {backgroundColor: colors.mainBlue}]}>
            <Text style={{color: 'white'}}>Olvide mi contraseña</Text>
          </TouchableOpacity>
          
        </View>
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
    auth:  state.login.user,
    error: state.login.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => {
      dispatch(actions.login(username, password))
    } 

  };
};

export default connect( mapStateToProps, mapDispatchToProps )(Login);

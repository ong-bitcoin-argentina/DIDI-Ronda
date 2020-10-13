import React, {useState, useEffect} from 'react';
import Config from 'react-native-config';
import {connect} from 'react-redux';
import {Button, Spinner} from 'native-base';
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableNativeFeedback,
  ImageBackground,
} from 'react-native';
import colors from '../../components/colors';
import * as actions from '../../../actions/auth';
import {
  deepLinkHandler,
  dynamicLinkHandler,
  loginSuccess,
  loginDenied,
  getToken,
  openAdiLogin,
} from './../../../utils/appRouter';
import Logo from '../../../assets/img/app-logo.svg';
const Login = props => {
  const handleLogin = async link => {
    if (!link) return;
    if (loginSuccess(link)) await loginWithAidi(getToken(link));
    else if (loginDenied(link)) props.navigation.navigate('AccessDenied');
  };

  const goToErrorScreen = () => props.navigation.navigate('AccessDenied');

  useEffect(deepLinkHandler(handleLogin), []);

  useEffect(dynamicLinkHandler(handleLogin), []);

  const sendToken = async () =>
    await loginWithAidi(
      'dUESJ7tmSnC4nnoTanLsyO:APA91bGzkN2xVYZhuXN6DKn7o1HtdjsFDbx4gjyORFVHd65tX-Vfh8acL1KgSsc5JJjbCI7OicGFrW0W8izsrScAs5ZwDet3lYIQEZgz5vfroUYKTiTpory2NiWhbJ4MuLOy1yNrt6jN',
    );

  const loginWithAidi = async token => await props.loginWithAidi(token);

  const onLoginWithAidi = async () => await openAdiLogin();

  const forgot = () => props.navigation.navigate('Forgot');

  const loading = () => (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Spinner color="white" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const {loading: isLoading} = props;

  if (isLoading) return loading();

  return (
    <ImageBackground
      source={require('../../../assets/img/loginbackground.png')}
      style={styles.backgroundImage}>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Logo height={120} width={140} />
        </View>
        <Button
          background={TouchableNativeFeedback.Ripple('lightgray', false)}
          onPress={onLoginWithAidi}
          style={styles.button}>
          <Text style={{fontSize: 18, color: 'white', fontWeight: 'bold'}}>
            Conectate con ai-di
          </Text>
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
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
    // backgroundColor: "white",
    backgroundColor: '#24CDD2',
    borderRadius: 8,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTransparent: {
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: 'transparent',
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
    auth: state.login.succeded,
    error: state.login.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => {
      dispatch(actions.login(username, password));
    },
    loginWithAidi: token => {
      dispatch(actions.loginWithAidi(token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

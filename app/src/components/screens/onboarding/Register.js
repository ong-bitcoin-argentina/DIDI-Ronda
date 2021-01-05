/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import { Button, Toast, Spinner } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Sae } from "react-native-textinput-effects";
import AsyncStorage from "@react-native-community/async-storage";
import colors from "../../components/colors";
import * as actions from "../../../actions/auth";
import {
  passwordChecker,
  passwordErrorsMessages,
} from "../../../utils/password";

const Register = props => {
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");

  const {
    navigation,
    registrationFinished,
    finish,
    loading,
    errorMessage,
  } = props;

  useEffect(() => {
    if (errorMessage) showWarningToast(errorMessage);
  }, [errorMessage]);

  const validateEmail = () => {
    // eslint-disable-next-line no-useless-escape
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email.trim()).toLowerCase());
  };

  const _onChangeName = newName => {
    setName(newName);
  };

  const _onChangeNick = newNick => {
    setNick(newNick);
  };

  const _onChangeEmail = newEmail => {
    setEmail(newEmail);
  };

  const _onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };

  const _onChangeVerify = newVerify => {
    setVerify(newVerify);
  };

  const returnToLogin = () => navigation.navigate("Login");

  const returnToLoginAndClear = () => {
    finish();
    return returnToLogin();
  };

  const showWarningToast = text => {
    return Toast.show({
      text,
      position: "top",
      type: "warning",
    });
  };

  const disclaimerBlockChain = () => {
    return (
      <View style={styles.container}>
        <Text
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 15,
            maxWidth: "90%",
          }}>
          Tu cuenta se encuentra en proceso de registro. Cuando termine, te
          llegará una notificación y podrás iniciar sesión.
        </Text>
        <Button
          background={TouchableNativeFeedback.Ripple("lightgray", false)}
          onPress={returnToLoginAndClear}
          style={[styles.button]}>
          <Text
            style={{
              textAlign: "center",
              color: "black",
              fontSize: 15,
              maxWidth: "90%",
            }}>
            Entendido
          </Text>
        </Button>
      </View>
    );
  };

  const _onRegister = async () => {
    if (nick.trim().length < 5)
      return showWarningToast("El nickname debe tener 5 o mas caracteres");

    const passwordError = passwordChecker(password, verify);
    if (passwordError)
      return showWarningToast(passwordErrorsMessages[passwordError]);

    if (!validateEmail() && name.length > 1)
      return showWarningToast("Debes utilizar un email valido");

    const fcmToken = await AsyncStorage.getItem("fcmToken");

    return props.createUser(
      email.trim(),
      password,
      name.trim(),
      fcmToken,
      nick.trim()
    );
  };

  if (registrationFinished) return disclaimerBlockChain();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      {loading && <Spinner color="white" />}
      {!loading && (
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>La ronda</Text>
            <Text style={styles.subtitle}>Registro</Text>
          </View>
          <Sae
            label="Nickname"
            value={nick}
            onBlur={() => setNick(nick.toLowerCase())}
            onChangeText={_onChangeNick}
            iconClass={FontAwesomeIcon}
            iconName="pencil"
            iconColor="white"
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize="none"
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Sae
            label="Nombre"
            value={name}
            onChangeText={_onChangeName}
            iconClass={FontAwesomeIcon}
            iconName="pencil"
            iconColor="white"
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize="none"
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Sae
            label="Email"
            value={email}
            onChangeText={_onChangeEmail}
            iconClass={FontAwesomeIcon}
            iconName="pencil"
            iconColor="white"
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize="none"
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Sae
            label="Contraseña"
            onChangeText={_onChangePassword}
            iconClass={FontAwesomeIcon}
            iconName="pencil"
            secureTextEntry
            inputPadding={16}
            labelHeight={24}
            value={password}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize="none"
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Sae
            label="Confirmar contraseña"
            onChangeText={_onChangeVerify}
            iconClass={FontAwesomeIcon}
            iconName="pencil"
            secureTextEntry
            value={verify}
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize="none"
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Button
            background={TouchableNativeFeedback.Ripple("lightgray", false)}
            onPress={_onRegister}
            style={styles.button}>
            <Text style={{ color: "black" }}>Registrate</Text>
          </Button>

          <TouchableOpacity
            onPress={returnToLogin}
            style={[
              styles.button,
              { backgroundColor: colors.mainBlue, marginTop: 10 },
            ]}>
            <Text style={{ color: "white" }}>Volver al inicio de sesion</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.mainBlue,
  },
  formContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    color: "white",
  },
  button: {
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "bold",
  },
  subtitle: { color: "white", fontSize: 18 },
});

const mapStateToProps = ({ onboarding }) => {
  return {
    loading: onboarding.loading,
    registrationFinished: onboarding.registrationFinished,
    errorMessage: onboarding.errorMessage,
    verified: onboarding.verified,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createUser: (username, password, name, token, nick) => {
      dispatch(actions.createUser(username, password, name, token, nick));
    },
    validateEmail: (username, token) => {
      dispatch(actions.verifyEmail(username, token));
    },
    finish: () => {
      dispatch(actions.finish());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);

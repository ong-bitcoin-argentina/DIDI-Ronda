import React, { useState, useEffect } from "react";
import Config from "react-native-config";
import { connect } from "react-redux";
import { Button, Spinner } from "native-base";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import colors from "../../components/colors";
import * as actions from "../../../actions/auth";
import { deepLinkHandler, dynamicLinkHandler, loginSuccess, loginDenied, getToken, openAdiLogin } from "./../../../utils/appRouter"

const Login = props => {

  const handleLogin = async link => {
    if (link == undefined && link == null ) return;
    if (loginSuccess(link)) await loginWithAidi(getToken(link));
    if (loginDenied(link)) props.navigation.navigate("AccessDenied");
  };

  const goToErrorScreen = () => props.navigation.navigate("AccessDenied");
  
  useEffect(deepLinkHandler(handleLogin))
 
  useEffect(dynamicLinkHandler(handleLogin));

  const sendToken = async () => await loginWithAidi("dUESJ7tmSnC4nnoTanLsyO:APA91bGzkN2xVYZhuXN6DKn7o1HtdjsFDbx4gjyORFVHd65tX-Vfh8acL1KgSsc5JJjbCI7OicGFrW0W8izsrScAs5ZwDet3lYIQEZgz5vfroUYKTiTpory2NiWhbJ4MuLOy1yNrt6jN");
  
  const loginWithAidi = async (token) => await props.loginWithAidi(token);

  const onLoginWithAidi = async () => await openAdiLogin();

  const forgot = () => props.navigation.navigate("Forgot");
  
  const loading = () => (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Spinner color="white" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  let subtitle = "Inicio de sesión";
  const { error, loading: isLoading } = props;
  const { QA } = Config;

  if (error) subtitle = "Usuario o contraseña incorrectos";

  if (isLoading) return loading();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>La Ronda</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Button
          background={TouchableNativeFeedback.Ripple("lightgray", false)}
          onPress={onLoginWithAidi}
          style={styles.button}
        >
          <Text style={{ color: "black" }}>Iniciar con aidi</Text>
        </Button>
        <TouchableOpacity
          onPress={forgot}
          style={[styles.button, { backgroundColor: colors.mainBlue }]}
        >
          <Text style={{ color: "white" }}>Recuperar Cuenta</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToErrorScreen}
          style={[styles.button, { backgroundColor: colors.mainBlue }]}
        >
          <Text style={{ color: "white" }}>Go to error Screen</Text>
        </TouchableOpacity>
        {QA && <TouchableOpacity
          onPress={sendToken}
          style={[styles.button, { backgroundColor: colors.mainBlue }]}
        >
          <Text style={{ color: "white" }}>Send Token</Text>

        </TouchableOpacity> }           
          
      </View>
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
  buttonTransparent: {
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: "transparent",
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
    loginWithAidi: (token) => {
      dispatch(actions.loginWithAidi(token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

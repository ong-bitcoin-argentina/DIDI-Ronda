import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, Text, KeyboardAvoidingView, StyleSheet } from "react-native";
import colors from "../../../components/colors";
import { Input, Form, Item, Button, Toast, Spinner } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Sae } from "react-native-textinput-effects";
import Success from "../Success";
import * as actions from "../../../../actions/auth";

const NewPassword = props => {
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [passwordColor, setPasswordColor] = useState("white");
  const username = props.navigation.getParam("username", null);
  const token = props.navigation.getParam("token", null);

  _sendPassword = () => {
    if (
      password.trim() !== "" &&
      verify.trim() !== "" &&
      password.length > 5 &&
      verify.length > 5 &&
      password === verify
    ) {
      props.sendPassword(username, password, token);
    } else {
      Toast.show({
        text: "Las contraseñas deben coincidir y ser de almenos 6 caracteres",
        position: "top",
        type: "warning",
      });
    }
  };

  useEffect(() => {
    passwordValidation();
  }, [verify]);

  passwordValidation = () => {
    if (verifyPasswords()) {
      setPasswordColor("white");
    } else {
      setPasswordColor(colors.yellow);
    }
  };

  verifyPasswords = () => {
    return password === verify;
  };

  _onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };

  _onChangeVerify = newVerify => {
    setVerify(newVerify);
  };

  _loading = () => {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            <Spinner color="white" />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  if (props.loading) {
    return _loading();
  }

  if (props.changed) {
    return (
      <Success
        text={"Tu contraseña se cambió con exito!"}
        callback={() => props.navigation.navigate("Login")}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>La Ronda</Text>
          <Text
            style={[
              styles.subtitle,
              { width: 350, textAlign: "center", marginBottom: 30 },
            ]}
          >
            Ingresa tu nueva contraseña
          </Text>
          <Sae
            label={"Contraseña"}
            onChangeText={_onChangePassword}
            iconClass={FontAwesomeIcon}
            iconName={"lock"}
            iconColor={passwordColor}
            secureTextEntry={true}
            inputPadding={16}
            labelHeight={24}
            value={password}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize={"none"}
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Sae
            label={"Confirmar contraseña"}
            onChangeText={_onChangeVerify}
            iconClass={FontAwesomeIcon}
            iconName={"lock"}
            iconColor={passwordColor}
            secureTextEntry={true}
            value={verify}
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize={"none"}
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />

          <Button
            onPress={_sendPassword}
            style={[
              styles.button,
              { width: 200, flexDirection: "row", justifyContent: "center" },
            ]}
          >
            <Text style={{ color: "black", textAlign: "center" }}>Enviar</Text>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// define your styles
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
    width: "100%",
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
    loading: state.forgot.loading,
    changed: state.forgot.changed,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendPassword: (username, password, token) => {
      dispatch(actions.sendPassword(username, password, token));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPassword);

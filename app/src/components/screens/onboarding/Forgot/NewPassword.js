import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, Text, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Button, Toast, Spinner } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Sae } from "react-native-textinput-effects";
import colors from "../../../components/colors";
import Success from "../Success";
import * as actions from "../../../../actions/auth";
import {
  passwordChecker,
  passwordErrorsMessages,
} from "../../../../utils/password";

const NewPassword = props => {
  const [password, setPassword] = useState("");
  const [verify, setVerify] = useState("");
  const [passwordColor, setPasswordColor] = useState("white");
  const { navigation, loading, changed } = props;
  const username = navigation.getParam("username", null);
  const token = navigation.getParam("token", null);

  const sendPassword = () => {
    const passwordError = passwordChecker(password, verify);
    if (!passwordError) return props.sendPassword(username, password, token);

    return Toast.show({
      text: passwordErrorsMessages[passwordError],
      position: "top",
      type: "warning",
    });
  };

  useEffect(() => {
    passwordValidation();
  }, [verify]);

  const passwordValidation = () => {
    if (verifyPasswords()) {
      setPasswordColor("white");
    } else {
      setPasswordColor(colors.yellow);
    }
  };

  const verifyPasswords = () => {
    return password === verify;
  };

  const onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };

  const onChangeVerify = newVerify => {
    setVerify(newVerify);
  };

  const spinnerBody = () => {
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

  if (loading) return spinnerBody();

  if (changed) {
    return (
      <Success
        text="Tu contraseña se cambió con exito!"
        callback={() => props.navigation.navigate("Login")}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>La ronda</Text>
          <Text
            style={[
              styles.subtitle,
              { width: 350, textAlign: "center", marginBottom: 30 },
            ]}>
            Ingresa tu nueva contraseña
          </Text>
          <Sae
            label="Contraseña"
            onChangeText={onChangePassword}
            iconClass={FontAwesomeIcon}
            iconName="lock"
            iconColor={passwordColor}
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
            onChangeText={onChangeVerify}
            iconClass={FontAwesomeIcon}
            iconName="lock"
            iconColor={passwordColor}
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
            onPress={sendPassword}
            style={[
              styles.button,
              { width: 200, flexDirection: "row", justifyContent: "center" },
            ]}>
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

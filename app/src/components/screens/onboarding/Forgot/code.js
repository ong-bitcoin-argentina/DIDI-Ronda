import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import colors from "../../../components/colors";
import { Input, Form, Item, Button, Toast, Spinner } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Sae } from "react-native-textinput-effects";
import * as actions from "../../../../actions/auth";

const Forgot = props => {
  const [code, setCode] = useState("");
  const username = props.navigation.getParam("username", null);

  _sendToken = () => {
    props.sendToken(username, code);
  };
  _goToMail = () => {
    props.navigation.navigate("Forgot");
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

  let subtitle = `Te enviamos un codigo a ${username}, ponlo aqui`;

  if (props.valid !== null) {
    if (props.valid) {
      props.clean();
      props.navigation.navigate("NewPassword", {
        token: code,
        username: username,
      });
    } else {
      subtitle = "El codigo es incorrecto, intenta nuevamente";
    }
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
            {subtitle}
          </Text>
          <Sae
            label={"Codigo"}
            value={code}
            onChangeText={setCode}
            iconClass={FontAwesomeIcon}
            iconName={"lock"}
            iconColor={"white"}
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize={"none"}
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Button
            onPress={_sendToken}
            style={[
              styles.button,
              { width: 200, flexDirection: "row", justifyContent: "center" },
            ]}>
            <Text style={{ color: "black", textAlign: "center" }}>Enviar</Text>
          </Button>
          <TouchableOpacity
            onPress={_goToMail}
            style={[
              styles.button,
              {
                width: 200,
                backgroundColor: colors.mainBlue,
                flexDirection: "row",
                justifyContent: "center",
              },
            ]}>
            <Text style={{ color: "white", textAlign: "center" }}>Volver</Text>
          </TouchableOpacity>
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
    valid: state.forgot.valid,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendToken: (username, token) => {
      dispatch(actions.forgotCode(username, token));
    },
    clean: () => {
      dispatch(actions.cleanForgot());
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forgot);

import React, { useState } from "react";
import { Sae } from "react-native-textinput-effects";
import { connect } from "react-redux";
import { Button, Toast, Spinner } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
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

const Login = props => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onChangeEmail = newEmail => {
    setEmail(newEmail);
  };

  const onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };

  const onLogin = async () => {
    if (email.trim() && password.trim()) {
      await props.login(email, password);
    } else {
      Toast.show({
        text: "Usuario o contraseña no rellenados",
        position: "top",
        type: "warning",
      });
    }
  };

  const register = () => {
    props.navigation.navigate("Register");
  };

  const forgot = () => {
    props.navigation.navigate("Forgot");
  };

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

  if (error) subtitle = "Usuario o contraseña incorrectos";

  if (isLoading) return loading();

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>La Ronda</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Sae
          label="Email"
          value={email}
          onChangeText={onChangeEmail}
          iconClass={FontAwesomeIcon}
          iconName="user"
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
          onChangeText={onChangePassword}
          iconClass={FontAwesomeIcon}
          iconName="unlock-alt"
          iconColor="white"
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

        <Button
          background={TouchableNativeFeedback.Ripple("lightgray", false)}
          onPress={onLogin}
          style={styles.button}
        >
          <Text style={{ color: "black" }}>Iniciar sesión</Text>
        </Button>
        <Button
          background={TouchableNativeFeedback.Ripple("lightgray", false)}
          onPress={register}
          style={[styles.button, { marginTop: 10 }]}
        >
          <Text style={{ color: "black" }}>Registrate</Text>
        </Button>
        <TouchableOpacity
          onPress={forgot}
          style={[styles.button, { backgroundColor: colors.mainBlue }]}
        >
          <Text style={{ color: "white" }}>Olvide mi contraseña</Text>
        </TouchableOpacity>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

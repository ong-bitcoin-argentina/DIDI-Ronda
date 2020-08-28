import React, { useState, useEffect } from "react";
import { Sae } from "react-native-textinput-effects";
import { connect } from "react-redux";
import { Button, Toast, Spinner } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  Linking,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from "react-native";
import colors from "../../components/colors";
import * as actions from "../../../actions/auth";
import dynamicLinks from "@react-native-firebase/dynamic-links";

const Login = props => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onChangeEmail = newEmail => {
    setEmail(newEmail);
  };

  const onChangePassword = newPassowrd => {
    setPassword(newPassowrd);
  };
  
  const handleLoginOnDynamicLink = async link => {
    console.log("handleLoginOnDynamicLink",link);
    if (link != undefined && link != null ) {
      if (link.url.match(/loginSuccess/))
      {
        console.log("logging in...");
        await onLogin();
        console.log("logged");
        console.log("hi");
      }
    }
  };

  useEffect(() => {
    console.log("useEffect dynamicLinks");
    const unsubscribe = dynamicLinks().onLink(handleLoginOnDynamicLink);
    return () => unsubscribe();
  });
  
  useEffect(() => {
    console.log("useEffect getInitialLink");
    dynamicLinks().getInitialLink().then( link => { handleLoginOnDynamicLink(link); });
	}) 

  const onLogin = async () => {
    await props.login("ftorielli@atixlabs.com", "Admin1234");
    // if (email.trim() && password.trim()) {
    //   console.log("logged onLogin");
    // } else {
    //   Toast.show({
    //     text: "Usuario o contraseña no rellenados",
    //     position: "top",
    //     type: "warning",
    //   });
    // }
  };

  const onLoginWithAidi = async () => {
    Linking.openURL(`https://aidi.page.link/XktS`);
  }

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
        <Button
          background={TouchableNativeFeedback.Ripple("lightgray", false)}
          onPress={onLoginWithAidi}
          style={styles.button}
        >
          <Text style={{ color: "black" }}>Iniciar con aidi</Text>
        </Button>
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

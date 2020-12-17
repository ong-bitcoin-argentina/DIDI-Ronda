import React, { useState, useEffect } from "react";
import analytics from "@react-native-firebase/analytics";
import { connect } from "react-redux";
import { AppInstalledChecker } from "react-native-check-app-install";
import { Button, Spinner, Icon } from "native-base";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableNativeFeedback,
  ImageBackground,
  Linking,
} from "react-native";
import colors from "../../components/colors";
import * as actions from "../../../actions/auth";
import {
  deepLinkHandler,
  dynamicLinkHandler,
  loginSuccess,
  loginDenied,
  getToken,
  openAdiLogin,
  links,
  openPlayStoreToUpdateAidi,
} from "./../../../utils/appRouter";
import Logo from "../../../assets/img/app-logo.svg";
import LinkModal from "../../components/LinkModal";

const states = {
  initial: "initial",
  success: "success",
  denied: "denied",
};

const Login = props => {
  const [state, setState] = useState(states.initial);
  const [modalVisible, setModalVisible] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);

  const handleLogin = async link => {
    if (!link) return;
    if (loginSuccess(link)) {
      setState(states.success);
      await loginWithAidi(getToken(link));
    } else if (loginDenied(link)) {
      setState(states.denied);
    }
  };

  useEffect(() => {
    const unsubscribeDeep = deepLinkHandler(handleLogin);
    const unsubscribeDynamic = dynamicLinkHandler(handleLogin);
    return () => {
      unsubscribeDeep();
      unsubscribeDynamic();
    };
  }, []);

  const loginWithAidi = async token => await props.loginWithAidi(token);

  const onLoginWithAidi = async () => {
    const canOpen = await Linking.canOpenURL(links.login.deepLink);
    if (!canOpen) {
      const isInstalled = await AppInstalledChecker.isAppInstalledAndroid(
        "com.aidi"
      );
      setNeedUpdate(isInstalled);

      const name = isInstalled ? "ModalUpdateAidi" : "ModalInstallAidi";
      analytics().logScreenView({
        screen_class: name,
        screen_name: name,
      });

      return setModalVisible(true);
    }
    await openAdiLogin();
  };

  const openPlaystore = async () => {
    needUpdate ? await openPlayStoreToUpdateAidi() : await openAdiLogin();
  };

  // const forgot = () => props.navigation.navigate('Forgot');

  const loading = () => (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Spinner color="white" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );

  const { loading: isLoading, error } = props;

  if (isLoading) return loading();

  const renderAuthWarning = () => {
    const title = "¡Error de Autenticación!";
    const message =
      "Ha ocurrido un error al ingresar en Ronda con tu cuenta de ai·di.";

    return renderWarning(title, message);
  };

  const renderErrorLoginWarning = () => {
    const title = "¡Error de inicio de sesión!";
    const message =
      "Ha ocurrido un error al intentar iniciar sesión en Ronda con tu cuenta de ai·di.";

    return renderWarning(title, message);
  };

  const renderWarning = (title, message) => (
    <View style={styles.warning}>
      <Icon type="MaterialIcons" name="warning" style={styles.icon} />
      <Text style={[styles.warningText, { marginBottom: 6 }]}>{title}</Text>
      <Text style={[styles.warningText, { marginBottom: 6 }]}>{message}</Text>
      <Text style={styles.warningText}>Por favor, volvé a intentarlo.</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../../assets/img/loginbackground.png")}
      style={styles.backgroundImage}>
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Logo height={200} width={200} />
        </View>
        <Button
          background={TouchableNativeFeedback.Ripple("lightgray", false)}
          onPress={onLoginWithAidi}
          style={styles.button}>
          <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
            Conectate con ai·di
          </Text>
        </Button>
        {state === states.denied
          ? renderAuthWarning()
          : error
          ? renderErrorLoginWarning()
          : null}
      </View>

      <LinkModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onConfirm={openPlaystore}
        needUpdate={needUpdate}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.mainBlue,
  },
  formContainer: {
    width: "100%",
    flex: 1,
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  input: {
    color: "white",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#24CDD2",
    borderRadius: 8,
    width: "100%",
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
  icon: {
    color: colors.yellowStatus,
    fontSize: 40,
    marginBottom: 4,
  },
  warning: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: colors.whiteTransparent,
    borderRadius: 8,
    paddingVertical: 16,
  },
  warningText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
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
  mapDispatchToProps
)(Login);

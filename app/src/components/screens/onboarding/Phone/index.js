import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, Text, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Item, Button, Spinner, Icon, Picker, Toast } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Sae } from "react-native-textinput-effects";
import colors from "../../../components/colors";
import * as actions from "../../../../actions/auth";
import Code from "./code";
import Success from "../Success";

const Phone = props => {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("AR");
  const { loading, succeded, error, navigation } = props;
  const username = navigation.getParam("username", null);

  useEffect(() => props.clean(), []);
  useEffect(() => {
    if (error && error === "That phone already exists and it is verified") {
      Toast.show({
        text: "Este teléfono ya ha sido registrado",
        position: "top",
        type: "warning",
      });
    }
  }, [error]);

  const verifyCode = code => {
    props.sendCode(username, phone, country, code);
  };
  const sendPhone = () => {
    props.sendPhone(username, phone, country);
  };

  if (loading) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.formContainer}>
          <Spinner color="white" />
        </View>
      </KeyboardAvoidingView>
    );
  }

  if (succeded) {
    if (props.verify.succeded)
      return (
        <Success
          text="Tu cuenta se verifico correctamete"
          callback={() => props.navigation.navigate("LoadingAuth")}
        />
      );
    return (
      <Code sendCode={verifyCode} sentTo={phone} back={() => props.clean()} />
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
            Aun no ingresaste tu teléfono. Ingresa tu número de teléfono y el
            país
          </Text>
          <Item picker style={{ width: "80%" }}>
            <Picker
              mode="dropdown"
              iosIcon={
                <Icon
                  name="arrow-down"
                  type="MaterialIcons"
                  color="white"
                  style={{ color: "white" }}
                />
              }
              style={{ width: undefined, color: "white" }}
              placeholder="Pais"
              placeholderStyle={{ color: "white" }}
              placeholderIconColor="white"
              selectedValue={country}
              onValueChange={i => setCountry(i)}
            >
              <Picker.Item label="Argentina" value="AR" />
              <Picker.Item label="Uruguay" value="UY" />
            </Picker>
          </Item>
          <Sae
            label="Telefono"
            value={phone}
            onChangeText={setPhone}
            iconClass={FontAwesomeIcon}
            iconName="phone"
            iconColor="white"
            inputPadding={16}
            labelHeight={24}
            borderHeight={2}
            style={{ width: "80%" }}
            autoCapitalize="none"
            autoCorrect={false}
            labelStyle={{ color: "white" }}
          />
          <Button
            onPress={sendPhone}
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
    loading: state.phone.loading,
    succeded: state.phone.succeded,
    error: state.phone.error,
    verify: state.phone.verify,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    sendPhone: (username, phone, country) => {
      dispatch(actions.phone(username, phone, country));
    },
    sendCode: (username, phone, country, code) => {
      dispatch(actions.phoneVerifiyCode(username, phone, country, code));
    },
    clean: () => {
      // usefull to do a backbutton :)
      dispatch(actions.cleanPhone());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Phone);

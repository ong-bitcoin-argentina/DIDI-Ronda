import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  TouchableNativeFeedback,
} from "react-native";
import { Button } from "native-base";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Sae } from "react-native-textinput-effects";
import colors from "../../components/colors";

const VerifyAccount = props => {
  const { token, title, back, sendToken } = props;
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
            {title}
          </Text>
          <Sae
            label="Codigo"
            value={token}
            onChangeText={text => props.setToken(text)}
            iconClass={FontAwesomeIcon}
            iconName="lock"
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
            onPress={sendToken}
            background={TouchableNativeFeedback.Ripple("lightgray", false)}
            style={[
              styles.button,
              { width: 200, flexDirection: "row", justifyContent: "center" },
            ]}
          >
            <Text style={{ color: "black", textAlign: "center" }}>
              Verificar
            </Text>
          </Button>
          <TouchableOpacity
            onPress={back}
            style={[
              styles.button,
              {
                width: 200,
                backgroundColor: colors.mainBlue,
                flexDirection: "row",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Volver</Text>
          </TouchableOpacity>
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

export default VerifyAccount;

import React from 'react';
import { View, Text, StyleSheet,KeyboardAvoidingView, TouchableNativeFeedback, Linking } from "react-native";
import { Button } from "native-base";
import colors from "../../../components/colors";

const errorScreen = (props) => {

    const onLoginWithAidi = async () => {
        const loginUrl = `https://aidi.page.link/XktS`;
        const canOpenURL = await Linking.canOpenURL(loginUrl);
        if (canOpenURL) Linking.openURL(loginUrl);
        console.log("canOpenURL", canOpenURL, loginUrl);
    }
      
    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <View style={styles.formContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Ocurrió un error </Text>
                    <Text>El acceso fue denegado</Text>
                    <Button
                    background={TouchableNativeFeedback.Ripple("lightgray", false)}
                    onPress={onLoginWithAidi}
                    style={styles.button}
                    >
                    <Text style={{ color: "black" }}>Vuelve a Intentar</Text>
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.red,
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

export default errorScreen;
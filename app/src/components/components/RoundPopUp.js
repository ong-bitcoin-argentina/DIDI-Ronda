import React, { Component } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button } from "native-base";
import Modal from "react-native-modal";
import colors from "./colors";

export default class RoundPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: props.visible,
    };
    if (props.onRef) props.onRef(this);
  }

  componentWillUnmount() {
    const { onRef } = this.props;
    if (onRef) onRef(undefined);
  }

  renderButtons = () => {
    const {
      accept,
      notCloseAfterNegative,
      notCloseAfterPositive,
      positive,
      negative,
      acceptTitle,
      positiveTitle,
      disablePositive,
      negativeTitle,
    } = this.props;
    return (
      <React.Fragment>
        {accept && (
          <Button
            style={styles.accept}
            onPress={() => {
              accept();
              if (!notCloseAfterPositive) this.closePopUp();
            }}>
            <Text style={styles.buttonText}>{acceptTitle || "OK"}</Text>
          </Button>
        )}
        {positive && (
          <Button
            style={styles.positive}
            disabled={disablePositive || false}
            onPress={() => {
              positive();
              if (!notCloseAfterPositive) this.closePopUp();
            }}>
            <Text style={styles.buttonText}>{positiveTitle || "Aceptar"}</Text>
          </Button>
        )}
        {negative && (
          <Button
            style={styles.negative}
            onPress={() => {
              negative();
              if (!notCloseAfterNegative) this.closePopUp();
            }}>
            <Text style={styles.negativeButtonText}>
              {negativeTitle || "Cancelar"}
            </Text>
          </Button>
        )}
      </React.Fragment>
    );
  };

  closePopUp = () => {
    const { onBeforeClose } = this.props;
    if (onBeforeClose) onBeforeClose();
    this.setState({ isModalVisible: false });
  };

  openPopUp = () => {
    this.setState({ isModalVisible: true });
  };

  render() {
    const {
      icon,
      value,
      titleText,
      children,
      customContent,
      titleStyle = {},
      titleTextStyle = {},
    } = this.props;
    const { isModalVisible } = this.state;

    return (
      <Modal
        useNativeDriver
        animationType="slide"
        isVisible={isModalVisible}
        backdropColor="rgba(0,0,0,0.5)">
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.innerContainer}>
            {customContent ? (
              customContent()
            ) : (
              <>
                <View style={{ ...styles.titleContainer, ...titleStyle }}>
                  {icon && icon}
                  {value && <Text style={styles.value}>{value}</Text>}
                  <Text style={{ ...styles.title, ...titleTextStyle }}>
                    {titleText}
                  </Text>
                </View>
                {children && (
                  <View style={styles.childrenContainer}>{children}</View>
                )}
                <View style={styles.buttonsContainer}>
                  {this.renderButtons()}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  innerContainer: {
    paddingVertical: 25,
  },
  titleContainer: {
    alignItems: "center",
    alignContent: "space-around",
    justifyContent: "space-around",
  },
  negative: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  positive: {
    width: "100%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  accept: {
    width: "100%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  negativeButtonText: {
    color: colors.secondary,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    color: colors.gray,
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 15,
    paddingHorizontal: 25,
  },
  childrenContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: 60,
    marginVertical: 10,
  },
});

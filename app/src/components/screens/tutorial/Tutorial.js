import React, { useState, useEffect } from "react";
import { Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { getInset } from "react-native-safe-area-view";
import { View, Text, Icon, Spinner } from "native-base";
import Carousel from "react-native-snap-carousel";
import Colors from "../../components/colors";
import TutorialCard from "./TutorialCard";
import DotStepCounter from "./DotStepCounter";
import tutorial1 from "../../../assets/img/tutorial-1.svg";
import tutorial2 from "../../../assets/img/tutorial-2.svg";
import tutorial3 from "../../../assets/img/tutorial-3.svg";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const CARDS_HEIGHT =
  SCREEN_HEIGHT > 620 ? SCREEN_HEIGHT * 0.65 : SCREEN_HEIGHT * 0.75;

const topOffset = getInset("top");

const cards = [
  {
    title: "Empezá tu ronda",
    text: "Invita a las personas que quieras que se sumen a tu ronda.",
    image: tutorial1,
    placeholder: false,
  },
  {
    title: "¿Cómo funciona",
    text:
      "Indica cuánto aporta cada persona de tu ronda y con qué frecuencia se harán los pagos.",
    image: tutorial2,
    placeholder: false,
  },
  {
    title: "Sorteo o elección grupal",
    text:
      "El orden de números asignados a quienes participen de la ronda, puede ser por sorteo o por elección del administrador/a.",
    image: tutorial3,
    placeholder: false,
  },
  {
    title: "Sorteo o elección grupal",
    text:
      "El órden de ganadores puede ser por sorteo o por elección colaborativa del grupo.",
    image: tutorial3,
    placeholder: true,
  },
];
const getTutorialState = async (callback, secondCalback) => {
  try {
    const value = await AsyncStorage.getItem("tutorialFinished");
    if (value !== null) return callback();
    return secondCalback(false);
  } catch (error) {
    return false;
  }
};

const Tutorials = props => {
  const [step, nextStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorialState(() => {
      goHome(false);
    }, setLoading);
  }, []);

  const goHome = async (setFinish = true) => {
    setFinish && (await AsyncStorage.setItem("tutorialFinished", "true"));
    props.navigation.navigate("Main");
  };

  const renderItem = ({ item }) => {
    return <TutorialCard height={CARDS_HEIGHT} item={item} />;
  };

  const closeButton = (
    <TouchableOpacity style={{ flexDirection: "row" }} onPress={() => goHome()}>
      <Text style={styles.closeButton}>Cerrar </Text>
      <Icon style={{ color: "white" }} name="ios-close" />
    </TouchableOpacity>
  );

  const onBeforeSnapToItem = index => {
    if (index === cards.length - 1) return goHome();
    return null;
  };

  return loading ? (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Spinner color="white" />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.closeButtonContainer}>{closeButton}</View>

      <View style={styles.deckSwiperContainer}>
        <Carousel
          data={cards}
          renderItem={renderItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
          onSnapToItem={i => {
            nextStep(i);
          }}
          onBeforeSnapToItem={onBeforeSnapToItem}
        />
      </View>
      <View style={styles.dotStepCounterContainer}>
        <DotStepCounter items={cards} count={step} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotStepCounterContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    height: 50,
  },
  deckSwiperContainer: {
    height: CARDS_HEIGHT,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    width: "100%",
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 22,
  },
  closeButton: { fontSize: 20, color: "white" },
  closeButtonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: Colors.mainBlue,
    marginTop: topOffset,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: "8%",
  },
  container: {
    backgroundColor: Colors.mainBlue,
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
});

export default Tutorials;

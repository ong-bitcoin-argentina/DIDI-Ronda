import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { Button } from "native-base";
import WheelOfFortune from "react-native-wheel-of-fortune";
import LottieView from "lottie-react-native";

import Bookmark from "../../../components/Bookmark";
import CircleArrows from "../../../../assets/img/circle-arrows.svg";
import RoundPopUp from "../../../components/RoundPopUp";
import emptyAvatar from "../../../../assets/img/avatar.png";
import colors from "../../../components/colors";

const confettiAnimation = require("../../../../assets/animations/confetti.json");

const RuffleRoulette = props => {
  // Props
  const [wasSpinned, setwasSpinned] = useState(false);
  const { number, participants, onFinish } = props;
  // Hooks
  const [wheelWinner, setWheelWinner] = useState(null);
  const [disableRoulette, setDisableRoulette] = useState(false);

  //   Variables
  const candidates = participants.map(p => p);
  const rewards = candidates.map((p, index) => {
    if (p.thumbnailPath)
      return {
        uri: p.thumbnailPath,
        index,
      };
    if (p.admin) return `${p.name.split(" ")[0]} (Yo)`;
    return p.name.split(" ")[0];
  });

  const winner = Math.floor(Math.random() * candidates.length) + 1;

  const winnerParticipant = wheelWinner !== null && candidates[wheelWinner];

  const popUpTitle = winnerParticipant
    ? `Felicitaciones a ${winnerParticipant} #${number}`
    : "Vas a sortear al participante de este número de ronda.";

  // Mount
  useEffect(() => {
    if (candidates.length === 1) {
      const value = candidates[0];
      setWheelWinner(value);
    }
  }, []);

  // Methods
  const winnerCallback = value => {
    setWheelWinner(candidates[value]);

    setDisableRoulette(false);
  };

  const positiveAction = () => {
    // eslint-disable-next-line no-underscore-dangle
    if (!wasSpinned) {
      this.wheelRef._onPress();
      setDisableRoulette(true);
      setwasSpinned(true);
    }
  };

  const Confetti = () => (
    <>
      <View style={{ width: "100%", alignItems: "center", height: 375 }}>
        <Text style={styles.titleText}>Ganó</Text>

        <Bookmark outline number={number} />
        <Image
          source={
            wheelWinner.thumbnailPath
              ? { uri: wheelWinner.thumbnailPath }
              : emptyAvatar
          }
          style={{ height: 150, width: 150, borderRadius: 100, zIndex: -1 }}
        />
        <Text style={styles.textName}>{wheelWinner.name}</Text>
        <Button
          style={styles.button}
          onPress={() => onFinish(number, wheelWinner)}>
          <Text style={styles.buttonText}>Ok</Text>
        </Button>
        <LottieView
          pointerEvents="none"
          autoPlay
          loop={false}
          source={confettiAnimation}
          style={styles.confettiView}
        />
        <LottieView
          pointerEvents="none"
          autoPlay
          loop={false}
          source={confettiAnimation}
          style={styles.confettiViewLeft}
        />
      </View>
    </>
  );

  return (
    <>
      <RoundPopUp
        onRef={ref => {
          this.popUpRef = ref;
        }}
        customContent={wheelWinner !== null ? Confetti : null}
        visible
        titleText={popUpTitle}
        icon={<Bookmark outline number={number} />}
        positive={() => positiveAction()}
        positiveTitle={winnerParticipant ? "Ok" : "Girar Ruleta"}
        disablePositive={disableRoulette}
        notCloseAfterPositive={!winnerParticipant}>
        <View style={{ flexDirection: "column", width: "100%" }}>
          {candidates.length > 1 && (
            <View style={{ height: 300 }}>
              <WheelOfFortune
                onRef={ref => {
                  this.wheelRef = ref;
                }}
                rewards={rewards}
                knobSize={20}
                // eslint-disable-next-line global-require
                knoobSource={require("../../../../assets/img/navigation.png")}
                borderWidth={0}
                borderColor="#fff"
                playButton={() => (
                  <CircleArrows
                    width={120}
                    height={120}
                    style={styles.playButton}
                  />
                )}
                colors={["#73A4D0", "#4C7CBE"]}
                winner={winner}
                innerRadius={70}
                duration={3000}
                size={300}
                backgroundColor="#fff"
                getWinner={(v, i) => winnerCallback(i)}
              />
            </View>
          )}
        </View>
      </RoundPopUp>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    alignItems: "center",
  },
  rightColumn: {
    alignItems: "center",
  },
  middleColumn: {
    paddingHorizontal: 15,
  },
  button: {
    width: "80%",
    height: 44,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    zIndex: 1,
    position: "absolute",
    top: 325,
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
  titleText: {
    marginVertical: 5,

    fontSize: 22,
    color: colors.mainBlue,
    fontWeight: "bold",
  },
  textName: {
    marginVertical: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.mainBlue,
    textAlign: "center",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
  },
  playButton: {
    top: 20,
    zIndex: 10,
  },
  confettiView: {
    transform: [{ rotate: "52deg" }],
    zIndex: -10,
    width: "100%",
    top: -20,
    right: 65,
    position: "absolute",
  },
  confettiViewLeft: {
    transform: [{ rotate: "-42deg" }],
    zIndex: -10,
    width: "100%",
    bottom: -38,
    left: 35,
    position: "absolute",
  },
});

export default RuffleRoulette;

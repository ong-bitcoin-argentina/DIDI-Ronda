import React, { useState } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { Button } from "native-base";
import { connect } from "react-redux";
import CreationTitle from "../../CreationTitle";
import ScreenContainer from "../../ScreenContainer";
import SelectedList from "../ParticipantSelection/SelectedList";
import colors from "../../../../components/colors";
import PersonWithCheck from "../../../../components/icons/PersonWithCheck";
import RuffleRoulette from "../../RuffleRoulette";
import SubMenuContainer from "../RoundDetail/SubMenuContainer";
import ParticipantNumberItem from "./participantNumberItem";
import { setNewAssignedNumber } from "../../../../../actions/roundCreation";
import NumberListTitle from "./numberListTitle";

const screenIcon = {
  type: "MaterialIcons",
  name: "person-outline",
};

const getRemainingParticipants = (participants, assignedNumbers) => {
  const remainingParticipants = [...participants];
  assignedNumbers.forEach(p => {
    const index = remainingParticipants.findIndex(e => {
      return e.phone === p.phone;
    });

    if (index !== -1) {
      remainingParticipants.splice(index, 1);
    }
  });
  return remainingParticipants;
};

const getCurrentNumber = (assignedNumbers, maxNum) => {
  let nextNumber = 1;
  for (let i = nextNumber; i <= maxNum; i += 1) {
    if (!assignedNumbers.find(e => e.number === i)) {
      nextNumber = i;
      break;
    }
  }
  return nextNumber;
};

const getAssigned = assignedNumbers => {
  const numbers = assignedNumbers.sort((a, b) => a.number - b.number);
  return numbers;
};

const RuffleParticipants = props => {
  const {
    navigation,
    participants,
    assignedNumbers,
    turns,
    frequency,
    date,
    setNewAssignedNumber: addAssignedNumber,
    pickTurnsManual,
  } = props;
  // First we checked the already assigned participants
  const assignedNumbersData = getAssigned(assignedNumbers);
  const currentNumber = getCurrentNumber(assignedNumbersData, turns);

  const remainingParticipants = getRemainingParticipants(
    participants,
    assignedNumbersData
  );

  const [openRuffle, setOpenRuffle] = useState(false);

  const numberText = (
    <Text style={styles.currentNumberText}>{currentNumber}</Text>
  );

  const openRoulette = () => setOpenRuffle(true);

  const closeRoulette = (number, winnerParticipant) => {
    setOpenRuffle(false);
    const numberToAdd = {
      name: winnerParticipant.name,
      picture: winnerParticipant.thumbnailPath,
      phone: winnerParticipant.phone,
      date,
      number,
    };
    addAssignedNumber(number, numberToAdd);
  };

  const titleRufflingNumber = number => (
    <Text style={styles.title}>
      {`Sorteando el número\n`}
      {number}
    </Text>
  );

  const allParticipantsHaveNumberText = () => (
    <Text style={styles.title}>Sorteo Finalizado</Text>
  );

  const onCreatePress = () => {
    navigation.navigate("Finish");
  };

  const title = !remainingParticipants.length
    ? allParticipantsHaveNumberText()
    : titleRufflingNumber(numberText);

  const step = pickTurnsManual ? 9 : 8;

  return (
    <ScreenContainer navigation={navigation} step={step}>
      <CreationTitle
        title={title}
        renderCustomTitle
        iconName={screenIcon.name}
        iconType={screenIcon.type}
        renderCustomIcon={!remainingParticipants.length}
        customIcon={() => <PersonWithCheck />}
      />
      <SelectedList renderDetail={false} participants={remainingParticipants} />
      <View style={styles.container}>
        {!!remainingParticipants.length && (
          <Button onPress={openRoulette} style={styles.button}>
            <Text style={styles.buttonText}>Sortear Número</Text>
          </Button>
        )}
        {openRuffle && (
          <RuffleRoulette
            onFinish={closeRoulette}
            number={currentNumber}
            participants={remainingParticipants}
          />
        )}
        {!remainingParticipants.length && (
          <Button style={styles.button} onPress={onCreatePress}>
            <Text style={styles.buttonText}>Finalizar y Crear Ronda</Text>
          </Button>
        )}
        {!!assignedNumbersData.length && (
          <SubMenuContainer title="Números asignados">
            <NumberListTitle />
            <View style={{ flexDirection: "row", height: 5 }} />

            <FlatList
              data={assignedNumbersData}
              scrollEnabled
              style={{ marginTop: 5 }}
              renderItem={({ item }) => {
                return (
                  <ParticipantNumberItem
                    name={item.name}
                    picture={item.picture}
                    frequency={frequency}
                    number={item.number}
                    date={item.date}
                  />
                );
              }}
              keyExtractor={data => data.phone}
            />
          </SubMenuContainer>
        )}
      </View>
    </ScreenContainer>
  );
};
const mapStateToProps = ({ roundCreation }) => ({
  participants: roundCreation.participants,
  pickTurnsManual: roundCreation.pickTurnsManual,
  assignedNumbers: roundCreation.assignedNumbers,
  frequency: roundCreation.frequency,
  turns: roundCreation.turns,
  date: roundCreation.date,
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.gray,
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  currentNumberText: {
    color: colors.mainBlue,
    marginTop: 3,
    fontSize: 22,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default connect(
  mapStateToProps,
  { setNewAssignedNumber }
)(RuffleParticipants);

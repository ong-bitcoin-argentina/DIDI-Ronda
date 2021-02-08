import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";
import { Button } from "native-base";
import { connect } from "react-redux";
import CreationTitle from "../../CreationTitle";
import ScreenContainer from "../../ScreenContainer";
import SelectedList from "../ParticipantSelection/SelectedList";
import colors from "../../../../components/colors";
import SubMenuContainer from "../RoundDetail/SubMenuContainer";
import ParticipantNumberItem from "./participantNumberItem";
import {
  setNewAssignedNumber,
  removeAssignedNumber,
  saveCreationForLater,
  clearStore,
} from "../../../../../actions/roundCreation";
import NumberListTitle from "./numberListTitle";
import PreRuffleModal from "./PreRuffleModal";

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

const getAssigned = (assignedNumbers, maxNum, date) => {
  const maxNumInt = parseInt(maxNum, 10);
  const numbers = assignedNumbers.sort((a, b) => a.number - b.number);
  const newNumbers = [];
  for (let i = 0; i < maxNumInt; i += 1) {
    const actualNumber = i + 1;
    const indexOfNumber = numbers.findIndex(e => e.number === actualNumber);
    if (indexOfNumber === -1) {
      newNumbers.push({ number: actualNumber, date });
    } else {
      newNumbers.push(numbers[indexOfNumber]);
    }
  }
  return newNumbers.sort((a, b) => a.number > b.number);
};

const SelectParticipantNumbers = props => {
  const {
    navigation,
    participants,
    assignedNumbers,
    turns,
    frequency,
    date,
    setNewAssignedNumber: addAssignedNumber,
    removeNumber,
    saveRoundForLater,
    clearData,
  } = props;
  const [openPreRuffleModal, setopenPreRuffleModal] = useState(false);
  // We need a re-render for the List ref
  // eslint-disable-next-line no-unused-vars
  const [openedElements, setopenedElements] = useState(null);
  const numbersListRef = useRef(null);

  useEffect(() => {
    setopenedElements(0);
  }, []);

  // First we checked the already assigned participants
  const assignedNumbersData = getAssigned(assignedNumbers, turns, date);

  const remainingParticipants = getRemainingParticipants(
    participants,
    assignedNumbersData
  );

  const togglePreRuffleModal = () => {
    setopenPreRuffleModal(!openPreRuffleModal);
  };
  const onPressParticipant = (number, participant) => {
    const numberToAdd = {
      name: participant.name,
      picture: participant.thumbnailPath,
      phone: participant.phone,
      date,
      number,
    };

    addAssignedNumber(number, numberToAdd);
  };

  const onPressRemoveParticipantNumber = number => {
    removeNumber(number);
  };

  const onContinuePress = () => {
    togglePreRuffleModal();
    navigation.navigate("RuffleParticipants");
  };

  const onSaveRoundForLater = async () => {
    await saveRoundForLater();
    navigation.navigate("List");
    clearData();
  };

  const title =
    "Asigná los números a los participantes haciendo click en el número del listado y seleccionando al que corresponda, los demás podrán ser sorteados.";
  const allNumbersSelected =
    remainingParticipants && remainingParticipants.length === 0;
  return (
    <ScreenContainer navigation={navigation} step={5}>
      <CreationTitle
        title={title}
        titleViewStyle={{ paddingBottom: 5 }}
        titleTextStyle={{ fontSize: 14 }}
        iconSize={40}
        iconName={screenIcon.name}
        iconType={screenIcon.type}
      />
      <SelectedList
        avatarSize={30}
        renderDetail={false}
        participants={remainingParticipants}
      />
      <View style={styles.container}>
        <SubMenuContainer title="Números asignados">
          <NumberListTitle />
          <View style={{ flexDirection: "row", height: 5 }} />
          <FlatList
            data={assignedNumbersData}
            pinchGestureEnabled={false}
            ref={numbersListRef}
            getItemLayout={(data, index) => ({
              length: 70,
              offset: 70 * index,
              index,
            })}
            showsVerticalScrollIndicator
            style={{ marginTop: 5 }}
            renderItem={({ item }) => {
              return (
                <ParticipantNumberItem
                  name={item.name}
                  scrollableRef={numbersListRef}
                  picture={item.picture}
                  maxNumber={assignedNumbersData.length}
                  onPressRemoveParticipantNumber={
                    onPressRemoveParticipantNumber
                  }
                  onPressParticipant={onPressParticipant}
                  frequency={frequency}
                  remainingParticipants={remainingParticipants}
                  number={item.number}
                  date={item.date}
                />
              );
            }}
            keyExtractor={(data, index) => `${data.phone}-${index}`}
          />
        </SubMenuContainer>
        <Button style={styles.button} onPress={togglePreRuffleModal}>
          <Text style={styles.buttonText}>Continuar</Text>
        </Button>
      </View>
      <PreRuffleModal
        onSaveRoundForLater={onSaveRoundForLater}
        allNumbersSelected={allNumbersSelected}
        open={openPreRuffleModal}
        onContinue={onContinuePress}
        onCancel={togglePreRuffleModal}
      />
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
    fontSize: 16,
    fontWeight: "bold",
    color: colors.gray,
    textAlign: "center",
  },
  button: {
    width: "80%",
    height: 35,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  currentNumberText: {
    color: colors.mainBlue,
    marginTop: 3,
    fontSize: 18,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default connect(
  mapStateToProps,
  {
    setNewAssignedNumber,
    removeNumber: removeAssignedNumber,
    saveRoundForLater: saveCreationForLater,
    clearData: clearStore,
  }
)(SelectParticipantNumbers);

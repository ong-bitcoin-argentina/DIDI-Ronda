import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { connect } from "react-redux";
import * as roundsActions from "../../../../actions/rounds";

import {
  dateFormatString,
  availableNumberForRequest,
} from "../../../../utils/utils";

import RoundPopUp from "../../RoundPopUp";

import Item from "./Item";

const RequestNumberModal = props => {
  // Props
  const {
    round,
    auth,
    request_numbers,
    request_numbers_clean,
    show,
    requestNumbers,
    preSelectedNumbers,
  } = props;

  // Hooks
  const [selectedNumbers, setSelectedNumbers] = useState(
    preSelectedNumbers.map(n => n.number)
  );
  const [popUp, setPopUp] = useState(false);

  // Show listener
  useEffect(() => {
    show.show && openModal();
  }, [show]);

  useEffect(() => {
    if (requestNumbers.error) {
      Alert.alert("Hubo un error. Intente nuevamente.");
      request_numbers_clean();
    }
  }, [requestNumbers]);

  // Variables
  const title = `Ronda ${round.name}`;

  const numbers = round.shifts.map(shift => {
    const { number } = shift;
    const date = dateFormatString(shift.limitDate);
    const available = availableNumberForRequest(number, round, auth);

    return { number, date, available };
  });
  const userParticipant = round.participants.find(p => p.user._id === auth.id);

  // Methods
  const itemPressHandler = number => {
    const newSelected = selectedNumbers;

    if (newSelected.indexOf(number) === -1) {
      // Check shiftQty
      if (newSelected.length < userParticipant.shiftsQty) {
        newSelected.push(number);
      } else {
        Alert.alert(
          "Alcanzaste el līmite máximo de turnos asignados para elegir."
        );
      }
    } else {
      newSelected.splice(newSelected.indexOf(number), 1);
    }

    setSelectedNumbers([...newSelected]);
  };

  const requestNumbersMethod = () => {
    if (selectedNumbers.length > 0)
      request_numbers(userParticipant._id, round._id, selectedNumbers);
    else Alert.alert("Debe seleccionar al menos 1 número");
  };

  const openModal = () => {
    setPopUp(true);
  };

  // Render
  return (
    popUp && (
      <RoundPopUp
        visible
        onRef={ref => (this.child = ref)}
        titleText={title}
        positive={() => {
          requestNumbersMethod();
          setPopUp(false);
        }}
        negative={() => {
          setPopUp(false);
        }}
        positiveTitle="Eligir Número/s"
        negativeTitle="Rechazar"
        notCloseAfterPositive
      >
        <View style={styles.container}>
          <View style={styles.listContainer}>
            <FlatList
              scrollEnabled
              data={numbers}
              keyExtractor={n => `${n.number}`}
              style={{ height: "100%" }}
              renderItem={({ item }) => {
                const itemSelected =
                  selectedNumbers.indexOf(item.number) !== -1;
                return (
                  <Item
                    item={item}
                    selected={itemSelected}
                    pressHandler={() => itemPressHandler(item.number)}
                  />
                );
              }}
              extraData={selectedNumbers}
            />
          </View>
        </View>
      </RoundPopUp>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 15,
    maxHeight: "75%",
  },
  listContainer: {
    flexDirection: "row",
    flex: 1,
  },
});

const mapStateToProps = state => {
  return {
    requestNumbers: state.participant.requestNumbers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    request_numbers: (idParticipant, roundId, numbers) => {
      dispatch(roundsActions.requestNumbers(idParticipant, roundId, numbers));
    },
    request_numbers_clean: () => {
      dispatch(roundsActions.requestNumbersClean());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestNumberModal);

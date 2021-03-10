import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { Button } from "native-base";
import GenericModal from "../../components/GenericModal";
import colors from "../../components/colors";
import MonthCalendar from "../../components/MonthCalendar";
import { addMonths, isAfter } from "date-fns";
import { LocaleConfig } from "react-native-calendars";
import ErrorDateModal from "../roundsCreation/steps/date/ErrorDateModal";
import { LOCALE_CONFIG } from "../../../utils/constants";

const SCREEN_WIDTH = Dimensions.get("window").width;

const ConfirmCreateRoundFailed = props => {
  const { open, onCancel, onContinue } = props;

  const [selectedDate, setSelectedDate] = useState(null);
  const [showErrorDateModal, setShowErrorDateModal] = useState(false);
  const toggleErrorDateModal = () => setShowErrorDateModal(!showErrorDateModal);

  const today = new Date();
  const sixMonths = [];
  for (let i = 0; i < 7; i++) {
    const dateToAdd = addMonths(today, i);
    sixMonths.push(dateToAdd.toISOString());
  }

  LocaleConfig.locales.es = LOCALE_CONFIG;
  LocaleConfig.defaultLocale = "es";

  const onDayPress = d => {
    if (isAfter(d.timestamp, Date.now())) {
      setSelectedDate(d.dateString);
      return;
    }
    return toggleErrorDateModal();
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <MonthCalendar
          onDayPress={onDayPress}
          selectedDate={selectedDate}
          date={item}
        />
      </View>
    );
  };

  return (
    <>
      <GenericModal open={open}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>
              Debes seleccionar una nueva fecha de inicio de tu ronda
            </Text>
          </View>
          <View style={styles.flatListContainer}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              initialNumToRender={2}
              getItemLayout={(data, index) => ({
                index,
                length: 335,
                offset: index * 335,
              })}
              style={{
                marginTop: 10,
              }}
              keyExtractor={item => item}
              data={sixMonths}
              renderItem={renderItem}
              removeClippedSubviews
            />
          </View>
          <Button
            disabled={!selectedDate}
            onPress={!selectedDate ? null : () => onContinue(selectedDate)}
            style={[
              styles.button,
              {
                marginTop: 25,
                backgroundColor: !selectedDate
                  ? colors.inactiveBlue
                  : colors.mainBlue,
              },
            ]}>
            <Text style={styles.buttonText}>Seleccionar</Text>
          </Button>
          <Button
            onPress={() => {
              setSelectedDate(null);
              onCancel();
            }}
            style={[styles.button, { marginTop: 10 }]}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </Button>
        </View>
      </GenericModal>
      <ErrorDateModal
        open={showErrorDateModal}
        onOkPress={toggleErrorDateModal}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: colors.backgroundGray,
    overflow: "hidden",
    zIndex: 10,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  titleStyle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: colors.mainBlue,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  flatListContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
    height: 310,
  },
  item: {
    marginHorizontal: 10,
    height: 335,
  },
});

export default ConfirmCreateRoundFailed;

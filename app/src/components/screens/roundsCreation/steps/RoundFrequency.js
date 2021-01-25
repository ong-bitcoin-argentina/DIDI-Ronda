import React, { useState } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { Picker, Icon } from "native-base";
import colors from "../../../components/colors";
import ScreenContainer from "../ScreenContainer";
import NextButton from "../../../components/NextButton";
import { LocaleConfig } from "react-native-calendars";
import { addMonths, isAfter } from "date-fns";
import MonthCalendar from "../../../components/MonthCalendar";
import {
  monthNames,
  dayNamesShort,
  monthNamesShort,
  dayNames,
} from "../../../../utils/localization";
import ErrorDateModal from "./date/ErrorDateModal";
import UpdateModal from "./date/UpdateModal";
import * as actions from "../../../../actions/roundCreation";

const stepIcon = {
  type: "MaterialIcons",
  name: "access-alarm",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

const RoundFrequency = props => {
  const {
    frequency: selectedFreq,
    navigation,
    date,
    setDate,
    noParticipantEdit,
    editRoundRequest,
    clearData,
  } = props;

  const frequencyValues = [
    {
      label: "Mensual",
      value: "m",
    },
    {
      label: "Quincenal",
      value: "q",
    },
    {
      label: "Semanal",
      value: "s",
    },
    {
      label: "Diaria",
      value: "d",
    },
  ];
  const [frequency, setFrequency] = useState(selectedFreq);
  const [selectedDate, setSelectedDate] = useState(date || null);
  const [showUpdateModal, setshowUpdateModal] = useState(false);
  const [showErrorDateModal, setShowErrorDateModal] = useState(false);

  const toggleErrorDateModal = () => setShowErrorDateModal(!showErrorDateModal);
  const toggleUpdateModal = () => setshowUpdateModal(!showUpdateModal);
  const onErrorModalOkPress = () => toggleErrorDateModal();

  const onValueChange = val => setFrequency(val);

  const onOkPress = () => {
    toggleUpdateModal();
    props.navigation.navigate("List");
    clearData();
  };

  const today = new Date();
  const sixMonths = [];
  for (let i = 0; i < 7; i += 1) {
    const dateToAdd = addMonths(today, i);
    sixMonths.push(dateToAdd.toISOString());
  }

  LocaleConfig.locales.es = {
    monthNames,
    monthNamesShort,
    dayNames,
    dayNamesShort,
  };
  LocaleConfig.defaultLocale = "es";

  const renderItem = ({ item }) => (
    <View
      style={{
        marginHorizontal: 10,
        height: 335,
      }}>
      <MonthCalendar
        onDayPress={onDayPress}
        selectedDate={selectedDate}
        date={item}
      />
    </View>
  );

  const onDayPress = d => {
    if (isAfter(d.timestamp, Date.now())) {
      setSelectedDate(d.dateString);
      return setDate(d.dateString);
    }
    return toggleErrorDateModal();
  };

  const navigateToNextStep = () => {
    props.setFrequency(frequency);
    return props.navigation.navigate("RuffleOrSelection");
  };

  return (
    <ScreenContainer navigation={navigation} step={1}>
      <ScrollView style={{ flex: 1, backgroundColor: colors.backgroundGray }}>
        <View style={styles.titleContainer}>
          <Text
            style={
              styles.title
            }>{`¿Cada cuánto tiempo deberán\naportar el dinero?`}</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Icon
              type={stepIcon.type}
              name={stepIcon.name}
              style={styles.icon}
            />
            <View style={{ width: "100%" }}>
              <View
                style={{
                  width: "65%",
                  flexDirection: "row",
                }}>
                <Text style={{ fontSize: 13 }}>Período</Text>
              </View>
              <View
                style={{
                  width: "65%",
                  flexDirection: "row",
                  borderBottomColor: colors.secondary,
                  borderBottomWidth: 2,
                }}>
                <Picker
                  style={{ marginRight: 0 }}
                  textStyle={{ padding: 0 }}
                  selectedValue={frequency}
                  onValueChange={onValueChange}>
                  {frequencyValues.map(f => (
                    <Picker.Item
                      key={f.value}
                      label={f.label}
                      value={f.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{`¿Cuándo inicia la ronda?`}</Text>
        </View>
        <View style={styles.container}>
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
              width: "90%",
              marginLeft: SCREEN_WIDTH / 10,
            }}
            keyExtractor={item => item}
            data={sixMonths}
            renderItem={renderItem}
            removeClippedSubviews
          />
          {!!selectedDate && !noParticipantEdit && (
            <NextButton callback={navigateToNextStep} />
          )}
        </View>
      </ScrollView>
      {noParticipantEdit && (
        <View style={{ backgroundColor: colors.backgroundGray }}>
          <Button
            style={{
              alignSelf: "flex-end",
              width: "40%",
              justifyContent: "center",
              backgroundColor: colors.mainBlue,
              borderRadius: 10,
              margin: 10,
            }}
            onPress={toggleUpdateModal}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}>
              Terminar Edicion
            </Text>
          </Button>
        </View>
      )}
      {showUpdateModal && (
        <UpdateModal
          open={showUpdateModal}
          onOkPress={onOkPress}
          update={editRoundRequest}
        />
      )}
      <ErrorDateModal
        open={showErrorDateModal}
        onOkPress={onErrorModalOkPress}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
    paddingBottom: 30,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  icon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  label: {
    fontSize: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.backgroundGray,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
});

const mapStateToProps = ({ roundCreation }) => {
  return {
    date: roundCreation.date,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDate: date => {
      dispatch(actions.setDate(date));
    },
    editRoundRequest: () => dispatch(actions.editRoundRequest()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoundFrequency);

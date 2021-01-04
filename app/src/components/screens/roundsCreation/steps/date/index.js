import React, { useState } from "react";
import { View, Dimensions, Text, FlatList } from "react-native";
import { connect } from "react-redux";
import { Button } from "native-base";
import { addMonths, isAfter } from "date-fns";
import { LocaleConfig } from "react-native-calendars";

import ScreenContainer from "../../ScreenContainer";
import NextButton from "../../../../components/NextButton";

import colors from "../../../../components/colors";
import * as actions from "../../../../../actions/roundCreation";

import CreationTitle from "../../CreationTitle";
import MonthCalendar from "../../../../components/MonthCalendar";
import UpdateModal from "./UpdateModal";
import {
  monthNames,
  dayNamesShort,
  monthNamesShort,
  dayNames,
} from "../../../../../utils/localization";
import ErrorDateModal from "./ErrorDateModal";

const SCREEN_WIDTH = Dimensions.get("window").width;

const screenIcon = {
  type: "MaterialCommunityIcons",
  name: "calendar-check",
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

const RoundDate = props => {
  const {
    date,
    setDate,
    navigation,
    noParticipantEdit,
    editRoundRequest,
    clearData,
  } = props;
  const [selectedDate, setSelectedDate] = useState(date || null);
  const [showUpdateModal, setshowUpdateModal] = useState(false);
  const [showErrorDateModal, setShowErrorDateModal] = useState(false);

  const toggleUpdateModal = () => setshowUpdateModal(!showUpdateModal);

  const toggleErrorDateModal = () => setShowErrorDateModal(!showErrorDateModal);

  const onErrorModalOkPress = () => toggleErrorDateModal();

  const onOkPress = () => {
    toggleUpdateModal();
    navigation.navigate("List");
    clearData();
  };

  const onDayPress = d => {
    if (isAfter(d.timestamp, Date.now())) {
      setSelectedDate(d.dateString);
      return setDate(d.dateString);
    }
    return toggleErrorDateModal();
  };

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

  const nextStep = () => {
    navigation.navigate("RuffleOrSelection");
  };

  return (
    <ScreenContainer navigation={navigation} step={4}>
      <CreationTitle
        title="¿Cuándo inicia la ronda?"
        iconType={screenIcon.type}
        iconName={screenIcon.name}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.backgroundGray,
        }}>
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
          <NextButton callback={nextStep} />
        )}
      </View>
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

const mapStateToProps = ({ roundCreation }) => {
  return {
    date: roundCreation.date,
    noParticipantEdit: roundCreation.noParticipantEdit,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDate: date => {
      dispatch(actions.setDate(date));
    },
    editRoundRequest: () => dispatch(actions.editRoundRequest()),
    clearData: () => dispatch(actions.clearStore()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoundDate);

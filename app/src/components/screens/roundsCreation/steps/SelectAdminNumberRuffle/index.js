import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker, Button, Icon } from "native-base";
import GenericModal from "../../../../components/GenericModal";
import BookmarkWithExclamation from "../../../../components/icons/BookmarkWithExclamation";
import colors from "../../../../components/colors";

const askForNumber = `¿Querés tomar algún número\nde la ronda antes de iniciar el\nsorteo?`;

const askWhichNumber = "¿Qué número querés tomar?";

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
  },
  iconContainer: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  titleContainer: {
    flex: 0.15,
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
  pickerContainer: {
    flex: 0.25,
    flexDirection: "row",
    alignContent: "center",
  },
  pickerInnerContainer: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  rowButtonContainer: {
    flex: 0.2,
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
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
  pickerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
  },
  pickerIcon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
  label: {
    fontSize: 12,
  },
  labelContainer: {
    flexDirection: "row",
  },
  pickerBorderView: {
    width: "85%",
    flexDirection: "row",
    borderBottomColor: colors.secondGray,
    borderBottomWidth: 2,
  },
});

const renderPickerItems = number => {
  const items = [<Picker.Item key="invalid" label="Número" value={null} />];
  for (let i = 1; i <= number; i += 1) {
    const val = String(i);
    const item = <Picker.Item key={val} label={val} value={val} />;
    items.push(item);
  }
  return items.map(e => e);
};

const SelectAdminNumberRuffle = ({
  open,
  onSuccessPicking,
  turns,
  onCancel,
}) => {
  const [selectedNumber, setselectedNumber] = useState(null);
  const [renderPicker, setrenderPicker] = useState(false);

  const onPressSelectNumber = () => setrenderPicker(true);

  const currentTitle = renderPicker ? askWhichNumber : askForNumber;

  const onCancelProcess = () => {
    setrenderPicker(false);
    onCancel();
  };

  const onPickNumber = val => setselectedNumber(val);

  const onSelectedNumberFinish = () => onSuccessPicking(selectedNumber);

  return (
    <GenericModal open={open}>
      <View style={{ ...styles.container, flex: renderPicker ? 0.65 : 0.6 }}>
        <View style={styles.iconContainer}>
          <BookmarkWithExclamation />
        </View>
        {!renderPicker && <View style={{ flex: 0.1, flexDirection: "row" }} />}
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{currentTitle}</Text>
        </View>
        {!renderPicker && <View style={{ flex: 0.1, flexDirection: "row" }} />}

        {renderPicker && (
          <View style={styles.pickerContainer}>
            <>
              <View style={styles.pickerInnerContainer}>
                <Icon
                  style={{ marginRight: 25, color: "#9B9B9B" }}
                  type="MaterialCommunityIcons"
                  name="bookmark-outline"
                />
                <View style={{ width: "100%" }}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.label}>
                      {selectedNumber ? "Número" : "Elegir"}
                    </Text>
                  </View>
                  <View style={styles.pickerBorderView}>
                    <Picker
                      inlineLabel
                      placeholder="Elige un número"
                      selectedValue={selectedNumber}
                      onValueChange={onPickNumber}
                    >
                      {renderPickerItems(parseInt(turns, 10))}
                    </Picker>
                  </View>
                </View>
              </View>
            </>
          </View>
        )}

        {renderPicker ? (
          <>
            <View style={styles.rowButtonContainer}>
              <Button onPress={onSelectedNumberFinish} style={styles.button}>
                <Text style={styles.buttonText}>Elegir</Text>
              </Button>
            </View>
            <View style={styles.rowButtonContainer}>
              <Button onPress={onCancelProcess} style={styles.button}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.rowButtonContainer}>
              <Button onPress={onPressSelectNumber} style={styles.button}>
                <Text style={styles.buttonText}>Sí</Text>
              </Button>
            </View>
            <View style={styles.rowButtonContainer}>
              <Button onPress={onCancelProcess} style={styles.button}>
                <Text style={styles.buttonText}>No</Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </GenericModal>
  );
};

export default SelectAdminNumberRuffle;

import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { clearStore } from "../../../actions/roundCreation";
import ConfirmCloseModal from "./ConfirmCloseModal";

const CloseButton = ({ clearData, navigation }) => {
  const [showModal, setshowModal] = useState(false);

  function toggleShowModal() {
    setshowModal(!showModal);
  }
  function onPress() {
    toggleShowModal();
  }

  function onExit() {
    clearData();
    navigation.navigate("List");
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: "100%",
        justifyContent: "center",
      }}
    >
      <Icon
        name="cancel"
        type="MaterialIcons"
        style={{ fontSize: 25, color: "white", marginHorizontal: 10 }}
      />
      <ConfirmCloseModal
        open={showModal}
        onAccept={onExit}
        onCancel={toggleShowModal}
      />
    </TouchableOpacity>
  );
};

export default connect(
  null,
  { clearData: clearStore }
)(withNavigation(CloseButton));

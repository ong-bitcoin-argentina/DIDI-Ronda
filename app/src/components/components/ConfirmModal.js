import React, { useEffect } from "react";
import { Icon } from "native-base";
import RoundPopUp from "./RoundPopUp";
import colors from "./colors";

const ConfirmModal = props => {
  // Props
  const { title, positive, icon, iconType } = props;
  // Mount
  useEffect(() => {
    this.modal && this.modal.openPopUp();
  }, []);

  const getIconType = () => {
    switch (iconType) {
      case "error":
        return (
          <Icon
            type="MaterialCommunityIcons"
            name="close-circle"
            style={{ color: colors.mainBlue, fontSize: 60 }}
          />
        );
      case "success":
        return (
          <Icon
            type="MaterialCommunityIcons"
            name="check-circle"
            style={{ color: colors.green, fontSize: 60 }}
          />
        );
      default:
        return null;
    }
  };

  const iconComponent = icon || getIconType();

  // Render
  return (
    <RoundPopUp
      onRef={ref => (this.modal = ref)}
      titleText={title}
      positive={() => positive && positive()}
      positiveTitle="Aceptar"
      icon={iconComponent}
    />
  );
};

export default ConfirmModal;

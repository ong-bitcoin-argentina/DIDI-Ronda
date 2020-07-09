import React from "react";
import { Fab, Icon } from "native-base";
import colors from "./colors";

const NextButton = props => {
  return (
    <Fab
      active
      direction="up"
      style={{ backgroundColor: colors.mainBlue }}
      position="bottomRight"
      onPress={() => props.callback()}
    >
      <Icon name="ios-arrow-forward" />
    </Fab>
  );
};

export default NextButton;

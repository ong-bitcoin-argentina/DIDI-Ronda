import React from "react";
import { Fab, Icon } from "native-base";
import colors from "./colors";

export default BackButton = props => {
  return (
    <Fab
      active={true}
      direction="up"
      style={{ backgroundColor: colors.mainBlue }}
      position="bottomLeft"
      onPress={() => props.callback()}
    >
      <Icon name={"ios-arrow-back"} />
    </Fab>
  );
};

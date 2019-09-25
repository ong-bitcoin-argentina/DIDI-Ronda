import React from 'react'
import {Fab, Icon} from 'native-base';
import colors from './colors';

export default NextButton = props => {
  return (
    <Fab
      active={true}
      direction="up"
      style={{backgroundColor: colors.mainBlue}}
      position="bottomRight"
      onPress={() => props.callback()}>
      <Icon name={'ios-arrow-forward'} />
    </Fab>
  );
};

import React, {useState} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {Icon} from 'native-base';
import colors from '../../../components/colors';
import {Input, Item, Label} from 'native-base';
import ScreenContainer from '../ScreenContainer';
import NextButton from '../../../components/NextButton';
import {setName} from '../../../../actions/roundCreation';
import BackButton from '../../../components/BackButton';

export default RoundName = props => {
  const [value, setValue] = useState(props.name);
  return (
    <ScreenContainer title={'Como se va a llamar la ronda?'} step={0}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon
            type="MaterialIcons"
            name="filter-tilt-shift"
            style={styles.icon}></Icon>
          <Item style={{width: '80%', height: 75, borderColor: value.length > 0 ? colors.mainBlue : colors.secondary}} stackedLabel>
            <Label>Nombre de la ronda</Label>
            <Input
              placeholder="Escribi un nombre"
              value={value}
              onChangeText={text => setValue(text)}
            />
          </Item>
        </View>
        {value != '' && (
          <NextButton
            callback={() => {
              props.setName(value);
              props.navigation.navigate('Amount');
            }}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center'},
  icon: {
    marginHorizontal: '10%',
    color: '#9B9B9B',
  },
});

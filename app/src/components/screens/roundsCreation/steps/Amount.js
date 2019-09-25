import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Button} from 'react-native';
import {Text, Icon, Item, Label, Input, Toast} from 'native-base';
import colors from '../../../components/colors';
import ScreenContainer from '../ScreenContainer';

const ManualValue = props => {
  const [value, setValue] = useState('');

  const validateInput = text => {
    const numberRegex = /[^0-9]/;
    const validate = numberRegex.test(text);

    if ( !validate ) {
      console.log("Set state...");
      setValue(text)
    } else {
      Toast.show({
          text: 'Solo números aceptados',
          position: 'top',
          type: 'warning'
      });
    }
  }

  return (
    <View style={styles.manualValueContainer}>
      <View style={styles.iconContainer}>
        <Icon name={'logo-usd'} style={styles.icon}></Icon>
        <Item style={{width: '80%'}} stackedLabel>
          <Label>Valor del numero</Label>
          <Input
            placeholder="Ingrese el monto"
            value={value}
            onChangeText={text => validateInput( text )}
            keyboardType="number-pad"
          />
        </Item>
      </View>
      {value != '' && (
        <NextButton
          callback={() => {
            props.callback(value);
          }}
        />
      )}
    </View>
  );
};

export default Amount = props => {
  const [otherValue, setOtherValue] = useState(false);

  function setValue(value) {
    props.setAmount(value);
  }

  const amounts = ['500', '1000', '2000', '2500', '3000'];


  return (
    <ScreenContainer title={'¿Cuanta plata van a juntar?'} step={1}>
      {!otherValue ? (
        <View style={styles.container}>

          {
            amounts.map( (value, idx) => (
              <View style={styles.amountContainer} key={idx}>
                <TouchableOpacity
                  onPress={() => {
                    setValue( value );
                    props.navigation.navigate('RoundConfig');
                  }}
                  style={styles.amountValueContainer}>
                  <Text style={styles.amountValue}>${value}</Text>
                </TouchableOpacity>
              </View>
            ))
          }
            
          <View style={styles.amountContainer}>
            <TouchableOpacity
              style={[
                styles.amountValueContainer,
                {backgroundColor: colors.secondary},
              ]}
              onPress={() => {
                setOtherValue(true);
              }}>
              <Text style={styles.amountValue}>Otro</Text>
            </TouchableOpacity>
          </View>

        </View>
      ) : (
        <ManualValue
          callback={val => {
            setValue(val), props.navigation.navigate('RoundConfig');
          }}></ManualValue>
      )}
    </ScreenContainer>
  );
};
const styles = StyleSheet.create({
  manualValueContainer: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundGray,
  },
  amountContainer: {
    justifyContent: 'space-around',
    width: '50%',
    alignItems: 'center',
  },
  amountValueContainer: {
    height: 100,
    width: 100,
    borderRadius: 60,
    backgroundColor: colors.mainBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountValue: {
    color: 'white',
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center'},
  icon: {marginHorizontal: '10%'},
});

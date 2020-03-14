import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Button} from 'react-native';
import {Text, Icon, Item, Label, Input, Toast} from 'native-base';
import colors from '../../../components/colors';
import ScreenContainer from '../ScreenContainer';

const ManualValue = props => {
  const [value, setValue] = useState(0);

  const validateInput = text => {
    const numberRegex = /[^0-9]/;
    const validate = numberRegex.test(text);

    if (!validate) {
      console.log('Set state...');
      setValue(text);
    } else {
      Toast.show({
        text: 'Solo números aceptados',
        position: 'top',
        type: 'warning',
      });
    }
  };

  return (
    <View style={{backgroundColor: colors.backgroundGray, flex: 1}}>
      <View style={styles.manualValueContainer}>
        <View style={styles.leftIcon}>
          <Icon name="logo-usd" style={{fontSize: 14, color: 'white'}} />
        </View>

        <View style={styles.otherContainer}>
          <Icon name="logo-usd" style={styles.icon} />

          <Item style={styles.otherItem} stackedLabel>
            <Label style={styles.otherLabel}>Monto</Label>
            <Input
              placeholder="0,00"
              value={value}
              onChangeText={text => validateInput(text)}
              keyboardType="number-pad"
              style={styles.otherTextInput}
            />
          </Item>
        </View>
      </View>

      {value !== '' && <NextButton callback={() => props.callback(value)} />}
    </View>
  );
};

export default Amount = props => {
  const [otherValue, setOtherValue] = useState(false);

  function setValue(value) {
    props.setAmount(value);
  }

  const amounts = ['1000', '2000', '3000', '5000', '10000'];

  const formatNumber = num =>
    num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

  return (
    <ScreenContainer title={'¿Cuanta plata van a juntar?'} step={1}>
      {!otherValue ? (
        <View style={styles.container}>
          {amounts.map((value, idx) => (
            <View style={styles.amountContainer} key={idx}>
              <TouchableOpacity
                onPress={() => {
                  setValue(value);
                  props.navigation.navigate('RoundConfig');
                }}
                style={styles.amountValueContainer}>
                <Text style={styles.amountValue}>${formatNumber(value)}</Text>
              </TouchableOpacity>
            </View>
          ))}

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
    backgroundColor: colors.backgroundGray,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'stretch',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundGray,
    paddingHorizontal: 50,
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
    fontSize: 18,
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center'},
  icon: {
    color: colors.mainBlue,
    fontSize: 30,
    position: 'absolute',
    top: 30,
  },
  otherTextInput: {
    fontSize: 26,
    width: '100%',
    textAlign: 'center',
    height: 75,
  },
  otherItem: {
    paddingHorizontal: 50,
    height: 75,
    minWidth: '60%',
    paddingLeft: 30,
  },
  otherLabel: {
    marginLeft: -30,
  },
  otherContainer: {},
  leftIcon: {
    backgroundColor: 'gray',
    borderRadius: 10,
    width: 20,
    height: 20,
    marginRight: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

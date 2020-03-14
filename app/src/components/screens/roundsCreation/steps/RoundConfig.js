//import liraries
import React, {Component, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../../components/colors';
import {Input, Item, Label, Icon, Toast} from 'native-base';
import ScreenContainer from '../ScreenContainer';
import NextButton from '../../../components/NextButton';

const FrequencyPicker = props => {
  const [val, setVal] = useState('m');

  useEffect(() => props.value(val), [val]);

  return (
    <View style={styles.frequency}>
      <TouchableOpacity
        onPress={() => setVal('s')}
        style={[
          styles.frequencyValueContainer,
          {borderTopLeftRadius: 5, borderBottomLeftRadius: 5},
          ,
          val == 's' && {backgroundColor: colors.mainBlue},
        ]}>
        <Text style={[styles.frequencyValue, val == 's' && {color: 'white'}]}>
          Semanal
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setVal('q')}
        style={[
          styles.frequencyValueContainer,
          ,
          val == 'q' && {backgroundColor: colors.mainBlue},
        ]}>
        <Text style={[styles.frequencyValue, val == 'q' && {color: 'white'}]}>
          Quincenal
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setVal('m')}
        style={[
          styles.frequencyValueContainer,
          {borderTopRightRadius: 5, borderBottomRightRadius: 5},
          ,
          val == 'm' && {backgroundColor: colors.mainBlue},
        ]}>
        <Text style={[styles.frequencyValue, val == 'm' && {color: 'white'}]}>
          Mensual
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const InputWithLock = props => {
  const [lock, setLock] = useState(false);
  const [val, setVal] = useState(props.default || '');

  const validateInput = text => {
    const numberRegex = /[^0-9]/;
    const validate = numberRegex.test(text);

    if (!validate) {
      setVal(text);
    } else {
      Toast.show({
        text: 'Solo números aceptados',
        position: 'top',
        type: 'warning',
      });
    }
  };
  useEffect(() => {
    props.notEmpty(val.trim() != '');
    props.value(val.trim());
  }, [val]);
  if (props.calculated && props.calculated != Infinity && !lock) {
    setVal(props.calculated.toString());
    setLock(true);
  }

  if (props.calculated && props.calculated == Infinity && lock) {
    setVal('');
    setLock(false);
  }
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon
        name={props.icon}
        style={{
          color: colors.secondary,
          position: 'absolute',
          left: '10%',
        }}></Icon>
      <View
        style={{
          height: 100,
          width: '50%',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Item style={{}} bordered fixedLabel>
          <Label
            style={{
              position: 'absolute',
              top: -20,
              fontSize: 13,
              color: colors.secondary,
            }}>
            {props.label}
          </Label>
          <Icon
            active
            name={props.inputIcon || props.icon}
            type={props.inputIconFamily || null}
            style={{color: colors.secondary, position: 'absolute'}}
          />
          <Input
            placeholderTextColor={colors.secondary}
            placeholder={'---'}
            style={{
              color: colors.mainBlue,
              fontSize: 24,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            disabled={lock}
            value={
              props.calculated && props.calculated != Infinity
                ? Math.ceil(props.calculated).toString()
                : val
            }
            onChangeText={text => validateInput(text)}
            keyboardType="number-pad"
          />
        </Item>
        <TouchableOpacity onPress={() => setLock(!lock)}>
          <Icon
            type="MaterialIcons"
            name={lock ? 'lock-outline' : 'lock-open'}
            style={{
              color: lock ? colors.mainBlue : colors.secondary,
              fontSize: 18,
            }}></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const RoundConfig = props => {
  const [inputs, setInputs] = useState({
    participantsQty: false,
    amount: props.amount || false,
    numVal: false,
  });
  const [values, setValues] = useState({
    participantsQty: '',
    amount: props.amount || '',
    numVal: '',
  });
  const [frequency, setFrequency] = useState('m');
  const [next, setNext] = useState(false);

  const [calculated, setCalculated] = useState(false);

  function inputReady(input, val) {
    let newValue = inputs;
    newValue[input] = val;
    setInputs[newValue];
    getInputs();
  }
  function saveValue(input, val) {
    let newValue = values;
    newValue[input] = val;
    calculate(newValue);
    setValues(newValue);
  }

  function calculate(newValues) {
    let calculatedValue = newValues.amount / newValues.participantsQty;
    setCalculated(calculatedValue);
  }
  function getInputs() {
    for (input in inputs) {
      if (!inputs[input]) {
        setNext(false);
        return;
      }
    }
    setNext(true);
  }

  function navigateToNextStep() {
    if (values.participantsQty < 2) {
      Toast.show({
        text: 'Deben haber 2 números o mas',
        position: 'bottom',
        type: 'warning',
      });
      return null;
    }
    props.setConfig({...values, frequency});
    props.navigation.navigate('SelectParticipants');
  }

  return (
    <ScreenContainer title={'Configurando la ronda'} step={2}>
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: colors.backgroundGray,
          flex: 1,
        }}>
        <InputWithLock
          icon={'logo-usd'}
          label={'Monto a juntar'}
          notEmpty={val => inputReady('amount', val)}
          value={val => saveValue('amount', val)}
          default={props.amount}
        />
        <FrequencyPicker value={val => setFrequency(val)} />
        <InputWithLock
          icon={'ios-person'}
          label={'Cantidad de Numeros'}
          inputIconFamily="Feather"
          inputIcon={'hash'}
          notEmpty={val => inputReady('participantsQty', val)}
          value={val => saveValue('participantsQty', val)}
        />
        <InputWithLock
          icon={'logo-usd'}
          label={'Aporte por numero'}
          notEmpty={val => inputReady('numVal', val)}
          value={val => saveValue('numVal', val)}
          calculated={calculated}
        />
      </View>
      {next && <NextButton callback={navigateToNextStep} />}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  frequency: {
    width: '100%',
    justifyContent: 'center',
    marginVertical: 20,
    flexDirection: 'row',
  },
  frequencyValueContainer: {
    width: '33%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderColor: colors.mainBlue,
  },
  frequencyValue: {
    fontSize: 18,
    textAlign: 'center',
    color: colors.mainBlue,
  },
});

//make this component available to the app
export default RoundConfig;

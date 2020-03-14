import React from "react";
import {Icon} from 'native-base';
import colors from './components/colors'
import AsyncStorage from '@react-native-community/async-storage';

export default utils = {
    calculateCurrentShift(shifts){
    
        console.log(moment(shifts[0].limitDate))
    }
}

export const monthArray = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SETIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
];

export const daysArray = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const roundStatusArray = {
  'completed': 'Completada',
  'current': 'Actual',
  'draw': 'Sorteo',
  'pending': 'Pendiente',
}

export const roundFrequencyArray = {
  'd': 'Diaria',
  's': 'Semanal',
  'q': 'Quincenal',
  'm': 'Mensual',
}


export const getAuth = async () => {
  try {
    const auth = await AsyncStorage.getItem('auth');
    return auth ? JSON.parse( auth ) : null;
  } catch ( error ){
    return null;
  }
}

export const setAuth = async auth => {
  const authObject = JSON.stringify( auth );
  return await AsyncStorage.setItem('auth', authObject);
}

export const getToken = async () => {
  try {
    const auth = await AsyncStorage.getItem('auth');
    const user = auth ? JSON.parse( auth ) : null;
    return user.token;
  } catch ( error ){
    return null;
  }
}

export const logOut = async () => {
  try {
    await AsyncStorage.removeItem('auth');
    return true;
  } catch( error ){
    return false;
  }
}

export const amountFormat = amount => {
  const roundedAmount = (Math.round(amount * 100) / 100).toString().replace('.',',');
  return roundedAmount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export const dateFormat = date => {
  const dateObject = new Date( date );
  return `${dateObject.getDate()}/${dateObject.getMonth()}/${dateObject.getFullYear()}`
}

export const dateFormatString = date => {
  const dateObject    = new Date( date );
  
  const dayName         = daysArray[ dateObject.getDay() ].substr(0,3)
  const formatedDayName = ucFirst( dayName )
  const dayNumber       = dateObject.getDate()
  const monthName       = ucFirst( monthArray[ dateObject.getMonth() ] )
  const yearNumber      = dateObject.getFullYear()
      
  return `${ formatedDayName }, ${ dayNumber } de ${ monthName } ${ yearNumber }`;
  
}

export const availableNumberForRequest = shift => {
  const asigned   = shift.participant.length > 0;
  const requested = shift.requests.length > 0;
  return !asigned && !requested;
}


const ucFirst = string => {
  return string.charAt(0).toUpperCase() + string.toLocaleLowerCase().slice(1);
}

const removeLastCharacter = string => {
  return string.substring(0, string.length - 1);
}
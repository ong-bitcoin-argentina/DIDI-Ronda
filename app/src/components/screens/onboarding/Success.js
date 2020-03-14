import React, {Component, useState, useEffect} from 'react';
import { connect } from 'react-redux';
import {View, Text, KeyboardAvoidingView, StyleSheet} from 'react-native';
import colors from '../../components/colors';
import {Input, Form, Item, Button, Toast, Spinner} from 'native-base';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Sae} from 'react-native-textinput-effects';


const Success = (props) => {
    useEffect(() => {
        setTimeout(() => props.callback(), 1300)
    }, [])
    return (      
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
          <View style={styles.formContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>La Ronda</Text>
                <Text style={[styles.subtitle, {width: 350, textAlign : 'center', marginBottom: 30}]}>
                  {props.text}
                </Text>
            </View>
            <Spinner color={'white'}></Spinner>
        </View>
      </KeyboardAvoidingView>)
};

// define your styles
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.mainBlue,
    },
    formContainer: {
      width: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      color: 'white',
    },
    button: {
      marginTop: 30,
      backgroundColor: 'white',
      borderRadius: 8,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 36,
      color: 'white',
      fontWeight: 'bold',
    },
    subtitle: {color: 'white', fontSize: 18},
  });
  

export default Success;

import React, {Component, useState, useEffect} from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, ScrollView, TouchableOpacity, Platform } from 'react-native';
import {Item, Input, Icon, Spinner} from 'native-base';
import Contacts from 'react-native-contacts';
import ScreenContainer from '../../ScreenContainer';
import colors from '../../../../components/colors';
import NextButton from '../../../../components/NextButton';

import SelectedList from './SelectedList';
import ContactList from './ContactList';
import SearchInput from './SearchInput';

class SelectParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: [],
      fullContactList: [],
      contactsPermission: false,
      loading: true,
    };
    this.checkPermissions();

    if (this.state.contactsPermission) {
      this.getContactsIos();
    }
  }

  getContactsIos() {
    Contacts.getAll((err, contacts) => {
      if (err) {
        throw err;
      }
      this.setState({
        fullContactList: contacts,
        contactList: contacts,
        contactsPermission: true,
        loading: false,
      });
    });
  }

  checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      // IOS
      Contacts.checkPermission((err, permission) => {
        if (err) throw err;
        if (permission === 'undefined') {
          Contacts.requestPermission((err, permission) => {});
        }
        if (permission === 'authorized') {
          this.getContactsIos();
        }
        if (permission === 'denied') {
          this.fillContactList();
        }
      });
    } else {
      // ANDROID
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contactos',
            message: 'Queremos usar tus contactos, pero necesitamos permisos.',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.fillContactList();
        } else {
          this.props.navigation.goBack();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  fillContactList = () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        this.setState({
          contactsPermission: false,
          fullContactList: [],
          contactList: [],
          loading: false,
        });
      } else {
        this.setState({
          contactList: contacts,
          fullContactList: contacts,
          contactsPermission: true,
          loading: false,
        });
      }
    });
  };

  addParticipant = contact => {
    if( contact.phoneNumbers && contact.phoneNumbers.length > 0 ){
      if (
        !this.props.participants.filter(
          participant =>
            participant.phoneNumbers[0].number == contact.phoneNumbers[0].number,
        ).length
      ) {
        let data = this.props.participants;
        contact.number = []
        data.push(contact);

        this.setState({});
        this.props.setParticipants(data);
      } else {
        alert('Ya agregaste a este participante');
      }
    } else {
      alert('El usuario necesita tener un numero para ser invitado');
    }
  }

  removeParticipant = contact => {
    let found = this.props.participants.find(p => {
      return p.phoneNumbers[0].number == contact.phoneNumbers[0].number;
    });
    if (found) {
      let data = this.props.participants;

      let index = data.indexOf(found);
      data.splice(index, 1);

      this.setState({});
      this.props.setParticipants(data);
    } else {
      alert('Este participante no estaba en la lista');
    }
  }
  filter(val) {
    let contacts = this.state.fullContactList;
    let rescontacts = contacts.filter(contact => {
      if (contact.familyName == null) {
        contact.familyName = '';
      }
      if (contact.givenName == null) {
        contact.givenName = '';
      }
      return (
        contact.familyName.toLowerCase().includes(val.toLowerCase()) ||
        contact.givenName.toLowerCase().includes(val.toLowerCase())
      );
    });
    this.setState({contactList: rescontacts});
  }

  resetFilter() {
    let contacts = this.state.fullContactList;
    this.setState({contactList: contacts});
  }

  render() {

    const {loading, contactsPermission, contactList} = this.state; 

    return (
      <ScreenContainer
        title="Elige los participantes"
        step={3}>
        <View style={ styles.container }>

          <SelectedList participants={ this.props.participants } pressHandler={ this.removeParticipant } />

          {
            loading ? 
              <Spinner /> :
              contactsPermission ?
              <View style={ styles.container }>
                <SearchInput
                  filter={val => this.filter(val)}
                  resetFilter={() => this.resetFilter()}
                  style={{flex:1}} />
                <View style={{flex: 1}}>
                  <ContactList contactList={ contactList } pressHandler={ this.addParticipant } />
                </View>
              </View> :
              <Text>Necesitamos permisos para acceder a tus contactos</Text>
          }

        </View>
        <NextButton
          callback={() => {
            this.props.navigation.navigate('RoundDate');
          }}></NextButton>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  contactThumbnail: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    width: '90%',
    justifyContent: 'center',
    color: colors.mainBlue,
    borderColor: colors.mainBlue,
    borderWidth: 3,
  },
  contactList: {
    flex: 1,
    flexDirection: 'row',
  }
});

//make this component available to the app
export default SelectParticipants;

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Item, Input, Icon, Label, Spinner, Toast} from 'native-base';
import Contacts from 'react-native-contacts';
import ScreenContainer from '../../ScreenContainer';
import colors from '../../../../components/colors';
import NextButton from '../../../../components/NextButton';

import SelectedList from './SelectedList';
import ContactList from './ContactList';
import SearchInput from './SearchInput';
import RoundPopUp from '../../../../components/RoundPopUp';
import {bigIntLiteral} from '@babel/types';

class SelectParticipants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactList: [],
      fullContactList: [],
      contactsPermission: false,
      loading: true,
      phantomName: '',
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

  phantomModal = () => {
    return (
      <RoundPopUp
        onRef={ref => (this.child = ref)}
        titleText={'Identifica a tu invitado'}
        positive={() => {
          this.state.phantomName.length
            ? this.addPhantomInvite()
            : Toast.show({
                text: 'El invitado debe tener un nombre',
                position: 'top',
                type: 'warning',
              });
        }}
        negative={() => {}}
        positiveTitle={'Agregar a la ronda'}>
        <View style={{paddingHorizontal: 20}}>
          <Text style={{textAlign: 'left'}}>
            Los demas integrantes de la ronda no podran saber su nombre
          </Text>
          <View style={{marginVertical: 15}}>
            <Text style={{textAlign: 'left'}}>
              {' '}
              -Su nombre no sera publico para el resto de los participantes.
            </Text>
            <Text style={{textAlign: 'left'}}>
              {' '}
              -No recibirá recordatorios ni información sobre la ronda.
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon type="Ionicons" name="md-person" style={styles.icon}></Icon>
            <Item
              style={{
                width: '65%',
                height: 75,
                borderColor:
                  this.state.phantomName > 0
                    ? colors.mainBlue
                    : colors.secondary,
              }}
              stackedLabel>
              <Label style={{fontWeight: 'bold', color: 'black'}}>
                Nombre invitado sin App
              </Label>
              <Input
                value={this.state.phantomName}
                onChangeText={text => this.setState({phantomName: text})}
                placeholder={'Nombre'}
                placeholderTextColor={colors.secondary}
              />
            </Item>
          </View>
        </View>
      </RoundPopUp>
    );
  };

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

  addPhantomInvite = () => {
    const name = this.state.phantomName;
    let user = {};
    user.user = {};
    user.user.name = name;
    user.number = [];
    user.phantom = true;
    user.thumbnailPath = '';

    this.addParticipant(user);
  };

  addParticipant = contact => {
    if (contact.phantom) {
      const data = this.props.participants;

      data.push(contact);

      this.setState({phantomName: ''});
      this.props.setParticipants(data);

      return true;
    }

    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      if (
        this.props.participants.find(p =>
          p.phantom
            ? false
            : p.phoneNumbers[0].number == contact.phoneNumbers[0].number,
        ) == undefined
      ) {
        let data = this.props.participants;
        contact.number = [];
        data.push(contact);

        this.setState({});
        this.props.setParticipants(data);
      } else {
        alert('Ya agregaste a este participante');
      }
    } else {
      alert('El usuario necesita tener un numero para ser invitado');
    }
  };

  removeParticipant = contact => {
    if (contact.phantom) {
      let data = this.props.participants;
      let index = data.indexOf(contact);
      data.splice(index, 1);

      this.setState({});
      this.props.setParticipants(data);

      return true;
    }
    let found = this.props.participants.find(p => {
      return p.phantom ? true : p.phoneNumbers[0].number == contact.phoneNumbers[0].number;
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
  };

  filter(val) {
    const contacts = this.state.fullContactList;
    const resContacts = contacts.filter(contact => {
      let {displayName} = {...contact};
      if (!displayName) return false;
      if (displayName.toLowerCase().includes(val.toLowerCase())) return true;
    });
    this.setState({contactList: resContacts});
  }

  resetFilter() {
    let contacts = this.state.fullContactList;
    this.setState({contactList: contacts});
  }

  render() {
    const {loading, contactsPermission, contactList} = this.state;

    return (
      <ScreenContainer title="Invita a los participantes" step={3}>
        <View style={styles.container}>
          <SelectedList
            participants={this.props.participants}
            pressHandler={this.removeParticipant}
          />

          {loading ? (
            <Spinner />
          ) : contactsPermission ? (
            <View style={styles.container}>
              <SearchInput
                filter={val => this.filter(val)}
                resetFilter={() => this.resetFilter()}
                style={{flex: 1}}
              />
              <TouchableOpacity onPress={() => this.child._openPopUp()}>
                <Text
                  style={{
                    fontSize: 11,
                    color: '#3198b5',
                    fontStyle: 'italic',
                    marginVertical: 10,
                    textDecorationLine: 'underline',
                  }}>
                  ¿Queres agregar un usuario que participara sin app?
                </Text>
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <ContactList
                  contactList={contactList}
                  pressHandler={this.addParticipant}
                />
              </View>
            </View>
          ) : (
            <Text>Necesitamos permisos para acceder a tus contactos</Text>
          )}
        </View>

        {this.props.participants.length > 0 && (
          <NextButton
            callback={() => this.props.navigation.navigate('RoundDate')}
          />
        )}
        {this.phantomModal()}
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
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  icon: {
    marginHorizontal: '10%',
    color: '#9B9B9B',
  },
});

//make this component available to the app
export default SelectParticipants;

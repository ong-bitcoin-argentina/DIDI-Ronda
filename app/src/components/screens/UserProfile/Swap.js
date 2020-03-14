import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import {Text, Spinner, Item, Input, Icon} from 'native-base';
import colors from '../../components/colors';
import Contacts from 'react-native-contacts';
import {connect} from 'react-redux';
import * as roundsActions from '../../../actions/rounds';
import SwapModal from './SwapModal';

import ContactList from './ContactList';

const Swap = props => {

    const [contacts, setContacts] = useState([]);
    const [fullContacts, setFullContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputVal, setInputVal] = useState('');

    const [modalProps, setModalProps] = useState({title:'', from:null, to:null, onPress:null});


    const { swapParticipant } = props;

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

    getContactsIos = () => {
        Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
            } else {
                setContacts( contacts )
                setFullContacts( contacts )
                setLoading( false )
            }
        });
    }

    fillContactList = () => {
        Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
            } else {
                setContacts( contacts )
                setFullContacts( contacts )
                setLoading( false )
            }
        });
    };

    if( swapParticipant.error !== null ){
        const errorMsg = swapParticipant.error.error.response.data.error;
        let customErrorMsg = "";
        // Error list
        switch ( errorMsg ) {
            case "Only admin can swap participants":
                customErrorMsg = "Solo el admin puede realizar reemplazos.";
                break;
            case "User exist in round":
                customErrorMsg = "El usuario ya existe en la ronda.";
                break;
            case "Cant swap round admin":
                customErrorMsg = "No se puede reemplazar al administrador.";
                break;
            case "New users must have a name":
                customErrorMsg = "El nuevo usuario debe tener un nombre.";
                break;
            default:
        }
        props.swap_clean();
        Alert.alert(`Hubo un error. ${customErrorMsg}`);
    } else {
        const round = swapParticipant.round;
        if( round !== null ){
            Alert.alert('Actualizado con éxito');
            props.swap_clean();
            props.navigation.navigate('RoundDetail', {'_id': round.data.id} )
        }
    }

    useEffect(() => {
        this.checkPermissions();
    }, []);

    useEffect(() => {

        // Filter contact list
        if (inputVal.trim() !== '') {
            const filteredContacts = fullContacts.filter( contact => {
                if (contact.familyName === null) {
                    contact.familyName = '';
                }
                if (contact.givenName === null) {
                    contact.givenName = '';
                }
                return (
                    contact.familyName.toLowerCase().includes( inputVal.toLowerCase() ) ||
                    contact.givenName.toLowerCase().includes( inputVal.toLowerCase() )
                );
            })
            setContacts( filteredContacts )
        } else {
            setContacts( fullContacts )
        }

    }, [inputVal]);

    const pressHandler = contact => {

        if( contact.phoneNumbers.length === 0 ) return Alert.alert("Debe seleccionar un contacto con número.");

        const { participant } = props;

        const newModalProps = {
            title: `Estás seguro que querés reemplazar a ${ participant.user.name }?`,
            onPress: () => swapRequest( contact ),
            from: participant.user,
            to: contact
        }

        setModalProps( newModalProps )

        // Open Modal
        this.child._openPopUp();


    }

    const swapRequest = contact => {

        const newUser = {
            name: contact.displayName,
            phone: contact.phoneNumbers[0].number
        }

        const { participant } = props;

        const roundId = participant.round;
        const idParticipant = participant._id;

        props.swap_participant( idParticipant, newUser, roundId );

    }

    return (
        <View>
           
            <SwapModal {...modalProps} onRef={ref => (this.child = ref)} />

            {
                loading || swapParticipant.loading ?
                <Spinner /> : 
                (
                    <View>
                        <View style={{paddingHorizontal: 20, marginVertical: 10}}>
                            <Item style={styles.searchContainer}>
                                <Icon active name={'search'} style={{color: colors.secondary}} />
                                <Input
                                    placeholderTextColor={colors.secondary}
                                    placeholder={'Buscar por nombre o alias'}
                                    style={{color: colors.mainBlue,fontStyle: inputVal.trim() != '' ? 'normal' : 'italic'}}
                                    value={ inputVal }
                                    onChangeText={ text => setInputVal(text) }
                                />
                            </Item>
                        </View>
                        <ContactList contactList={ contacts } pressHandler={ pressHandler } />
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        color: colors.mainBlue,
        borderColor: colors.mainBlue,
        borderWidth: 3,
    },
});

const mapStateToProps = state => {
    return {
        swapParticipant: state.rounds.swapParticipant,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        swap_participant: ( idParticipant, newUser, roundId ) => {
            dispatch( roundsActions.swapParticipant( idParticipant, newUser, roundId ) );
        },
        swap_clean: () => {
            dispatch( roundsActions.swapClean() );
        },
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(Swap);
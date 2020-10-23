import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { Spinner, Item, Toast, Label, Input, Icon } from "native-base";
import { connect } from "react-redux";
import Contacts from "react-native-contacts";
import colors from "../../components/colors";
import * as roundsActions from "../../../actions/rounds";
import SwapModal from "./SwapModal";

import ContactList from "./ContactList";

import ConfirmModal from "../../components/ConfirmModal";
import RoundPopUp from "../../components/RoundPopUp";
import { hasValidPhonePrefix } from "../../../utils/utils";

const Swap = props => {
  const [contacts, setContacts] = useState([]);
  const [fullContacts, setFullContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputVal, setInputVal] = useState("");
  const [confirmAlert, setConfirmAlert] = useState(null);
  const [phantomName, setPhantomName] = useState("");
  const [phantomNumber, setPhantomNumber] = useState("");

  const [modalProps, setModalProps] = useState({
    title: "",
    from: null,
    to: null,
    onPress: null,
  });

  const inputRef = useRef(null);

  const onSearchIconPress = () => {
    if (inputRef.current) {
      const { wrappedInstance } = inputRef.current;
      if (wrappedInstance.isFocused()) return wrappedInstance.blur();
      return wrappedInstance.focus();
    }
  };

  const formatPhoneNumber = phone => {
    return phone[0] === "+" || phone === "" ? phone : `+${phone}`;
  };

  const { swapParticipant, participant } = props;

  const { isBeingSwapped } = participant;
  const checkPermissions = async () => {
    if (Platform.OS === "ios") {
      // IOS
      Contacts.checkPermission((err, permission) => {
        if (err) throw err;
        if (permission === "undefined") Contacts.requestPermission(() => {});
        if (permission === "authorized") getContactsIos();
        if (permission === "denied") fillContactList();
      });
    } else {
      // ANDROID
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Contactos",
            message: "Queremos usar tus contactos, pero necesitamos permisos.",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          fillContactList();
        } else {
          const { navigation } = props;
          navigation.goBack();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getContactsIos = () => {
    Contacts.getAll((err, contactList) => {
      if (err === "denied") return null;
      setContacts(contactList);
      setFullContacts(contactList);
      return setLoading(false);
    });
  };

  const fillContactList = () => {
    Contacts.getAll((err, contactList) => {
      if (err === "denied") return null;
      setContacts(contactList);
      setFullContacts(contactList);
      return setLoading(false);
    });
  };

  useEffect(() => {
    if (swapParticipant.error !== null) {
      const errorMsg = swapParticipant.error.error.response.data.error;
      let customErrorMsg = "";
      // Error list
      switch (errorMsg) {
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
      setConfirmAlert({
        title: `Hubo un error. ${customErrorMsg}`,
        positive: () => setConfirmAlert(null),
        error: true,
      });
      props.swap_clean();
    } else {
      const { round } = swapParticipant;
      if (round !== null) {
        const confirmFunction = () => {
          setConfirmAlert(null);
          props.swap_clean();
          props.navigation.navigate("RoundDetail", { _id: round.data.id });
        };
        setConfirmAlert({
          title:
            "Reemplazo pedido con exito, te llegara una notificacion cuando se complete",
          positive: confirmFunction,
          error: false,
        });
      }
    }
  }, [swapParticipant]);

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    // Filter contact list
    if (inputVal.trim()) {
      const filteredContacts = fullContacts.filter(contact => {
        const finalContact = { ...contact };
        if (contact.familyName === null) {
          finalContact.familyName = "";
        }
        if (contact.givenName === null) {
          finalContact.givenName = "";
        }
        return (
          finalContact.familyName
            .toLowerCase()
            .includes(inputVal.toLowerCase()) ||
          finalContact.givenName.toLowerCase().includes(inputVal.toLowerCase())
        );
      });
      setContacts(filteredContacts);
    } else {
      setContacts(fullContacts);
    }
  }, [inputVal]);

  const phantomModal = () => {
    return (
      <RoundPopUp
        onRef={ref => (this.child2 = ref)}
        titleText="Identifica a tu invitado"
        positive={() => {
          const isValid =
            phantomName.length &&
            phantomNumber.length &&
            hasValidPhonePrefix(phantomNumber);
          if (isValid)
            return swapRequest({
              displayName: phantomName,
              phoneNumbers: [{ number: phantomNumber }],
            });
          return Toast.show({
            text:
              "El invitado debe tener un nombre y un telefono que respete el formato",
            position: "top",
            type: "warning",
          });
        }}
        negative={() => {}}
        positiveTitle="Reemplazar">
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ textAlign: "left" }}>
            Los demas integrantes de la ronda no podran saber su nombre
          </Text>
          <View style={{ marginVertical: 15 }}>
            <Text style={{ textAlign: "left" }}>
              -Su nombre no sera publico para el resto de los participantes.
            </Text>
            <Text style={{ textAlign: "left" }}>
              -No recibirá recordatorios ni información sobre la ronda.
            </Text>
          </View>
          <View style={styles.iconContainer}>
            <Icon type="Ionicons" name="md-person" style={styles.icon} />
            <Item
              style={{
                width: "65%",
                height: 75,
                borderColor:
                  phantomName > 0 ? colors.mainBlue : colors.secondary,
              }}
              stackedLabel>
              <Label style={{ fontWeight: "bold", color: "black" }}>
                Nombre invitado sin App
              </Label>
              <Input
                value={phantomName}
                onChangeText={text => setPhantomName(text)}
                placeholder="Nombre"
                placeholderTextColor={colors.secondary}
              />
            </Item>
          </View>
          <View style={styles.iconContainer}>
            <Icon type="Feather" name="hash" style={styles.icon} />
            <Item
              style={{
                width: "65%",
                height: 75,
                borderColor:
                  phantomName > 0 ? colors.mainBlue : colors.secondary,
              }}
              stackedLabel>
              <Label style={{ fontWeight: "bold", color: "black" }}>
                Número de telefono
              </Label>
              <Input
                keyboardType="numeric"
                value={phantomNumber}
                onChangeText={text => setPhantomNumber(formatPhoneNumber(text))}
                placeholder="Telefono"
                placeholderTextColor={colors.secondary}
              />
            </Item>
          </View>
        </View>
      </RoundPopUp>
    );
  };

  const pressHandler = contact => {
    if (contact.phoneNumbers.length === 0) {
      setConfirmAlert({
        title: "Debe seleccionar un contacto con número.",
        error: true,
      });
    } else {
      const newModalProps = {
        title: `¿Estás seguro que querés reemplazar a ${participant.user.name}?`,
        onPress: () => swapRequest(contact),
        from: participant.user,
        to: contact,
      };

      setModalProps(newModalProps);

      // Open Modal
      this.child && this.child.openPopUp();
    }
  };

  const swapRequest = contact => {
    const newUser = {
      name: contact.displayName,
      phone: contact.phoneNumbers[0].number,
    };
    const roundId = participant.round;
    const idParticipant = participant._id;

    props.swap_participant(idParticipant, newUser, roundId);
  };

  return (
    <View>
      {confirmAlert && <ConfirmModal {...confirmAlert} />}
      {!confirmAlert && (
        <SwapModal {...modalProps} onRef={ref => (this.child = ref)} />
      )}
      {(loading || swapParticipant.loading) && <Spinner />}
      {isBeingSwapped && (
        <View style={{ alignItems: "center" }}>
          <Spinner color={colors.mainBlue} size={40} />
          <Text style={{ textAlign: "center" }}>
            Se esta procesando el reemplazo del participante, te llegara una
            notificacion cuando termine
          </Text>
        </View>
      )}
      {!isBeingSwapped && (
        <View>
          <View
            style={{
              paddingHorizontal: 20,
              marginVertical: 10,
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Item style={styles.searchContainer}>
              <Icon
                onPress={onSearchIconPress}
                active
                name="search"
                style={{ color: colors.secondary }}
              />
              <Input
                ref={inputRef}
                placeholderTextColor={colors.secondary}
                placeholder="Buscar por nombre o alias"
                style={{
                  color: colors.mainBlue,
                  fontStyle: inputVal.trim() ? "normal" : "italic",
                }}
                value={inputVal}
                onChangeText={text => setInputVal(text)}
              />
            </Item>
            <TouchableOpacity
              onPress={() => {
                this.child2.openPopUp();
              }}>
              <Text
                style={{
                  fontSize: 11,
                  color: "#3198b5",
                  fontStyle: "italic",
                  marginVertical: 10,
                  textDecorationLine: "underline",
                }}>
                ¿Querés agregar a alguien que participará sin app ai·di?
              </Text>
            </TouchableOpacity>
          </View>

          <ContactList contactList={contacts} pressHandler={pressHandler} />
        </View>
      )}

      {phantomModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    color: colors.mainBlue,
    borderColor: colors.mainBlue,
    borderWidth: 3,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  icon: {
    marginHorizontal: "10%",
    color: "#9B9B9B",
  },
});

const mapStateToProps = state => {
  return {
    swapParticipant: state.rounds.swapParticipant,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    swap_participant: (idParticipant, newUser, roundId) => {
      dispatch(roundsActions.swapParticipant(idParticipant, newUser, roundId));
    },
    swap_clean: () => {
      dispatch(roundsActions.swapClean());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Swap);

import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Spinner } from "native-base";
import Contacts from "react-native-contacts";
import colors from "../../../../components/colors";
import NextButton from "../../../../components/NextButton";

import SelectedList from "./SelectedList";
import ContactList from "./ContactList";
import SearchInput from "./SearchInput";
import PhantomModal from "./PhantomModal";

import ConfirmModal from "../../../../components/ConfirmModal";
import { getAuth } from "../../../../../utils/utils";
import PeopleWithExclamation from "../../../../components/icons/PeopleWithExclamation";

const getAuthData = async () => {
  const auth = await getAuth();
  return auth;
};

class ParticipantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openedDoubleNumberNotice: false,
      contactList: [],
      fullContactList: [],
      phantomsToAppend: [],
      shouldRenderContacts: false,
      contactsPermission: false,
      loading: true,
      confirmAlert: null,
      auth: null,
      phantomModalVisible: false,
    };
  }

  async componentDidMount() {
    const { participants } = this.props;
    this.setState({ confirmAlert: null });
    const auth = await getAuthData();

    const haveAdmin = participants && participants.find(e => e.admin);

    this.setState(
      {
        auth,
        shouldRenderContacts: true,
      },
      () => {
        if (!haveAdmin) {
          this.addAdminParticipant();
        }
        this.checkPermissions();
      },
    );
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

  openModal = (title, iconType = "error", customIcon = null) => {
    const message = {
      title,
      positive: () => this.setState({ confirmAlert: null }),
      iconType,
      icon: customIcon,
    };
    this.setState({
      confirmAlert: message,
    });
  };

  // eslint-disable-next-line consistent-return
  checkPermissions = async () => {
    if (Platform.OS === "ios") {
      // IOS
      Contacts.checkPermission((err, permission) => {
        if (err) throw err;
        if (permission === "undefined") {
          Contacts.requestPermission();
        }
        if (permission === "authorized") {
          this.getContactsIos();
        }
        if (permission === "denied") {
          this.fillContactList();
        }
      });
    } else {
      // ANDROID
      try {
        const { READ_CONTACTS } = PermissionsAndroid.PERMISSIONS;
        const hasPermission = await PermissionsAndroid.check(READ_CONTACTS);
        if (!hasPermission) {
          const granted = await PermissionsAndroid.request(READ_CONTACTS, {
            title: "Contactos",
            message: "Queremos usar tus contactos, pero necesitamos permisos.",
            buttonNegative: "Cancelar",
            buttonPositive: "OK",
          });

          if (granted === PermissionsAndroid.RESULTS.GRANTED)
            return this.fillContactList();

          const { navigation } = this.props;
          return navigation.goBack();
        }
        return this.fillContactList();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  fillContactList = () => {
    const { auth, phantomsToAppend } = this.state;
    const admin = this.getAdminContactData(auth);
    Contacts.getAll((err, contacts) => {
      if (err === "denied")
        return this.setState({
          contactsPermission: false,
          fullContactList: [],
          contactList: [],
          loading: false,
        });

      return this.setState({
        contactList: [admin, ...phantomsToAppend, ...contacts],
        fullContactList: [admin, ...phantomsToAppend, ...contacts],
        contactsPermission: true,
        loading: false,
      });
    });
  };

  addPhantomInvite = (phantomName, phantomNumber) => {
    const { participants } = this.props;

    const user = {
      displayName: phantomName,
      phone: phantomNumber,
      phantom: true,
      thumbnailPath: "",
      givenName: phantomName,
      recordID: phantomNumber,
      phoneNumbers: [{ number: phantomNumber }],
    };

    const exists = participants.find(
      p => p.phantom && p.phone === phantomNumber,
    );

    const { phantomsToAppend } = { ...this.state };
    this.setState({ phantomsToAppend: phantomsToAppend.concat(user) }, () => {
      this.fillContactList();

      if (exists) {
        this.openModal("Este usuario ya fue agregado");
        return false;
      }

      return this.addParticipant(user);
    });
  };

  addShiftsToParticipant = (participant, newShiftQty) => {
    const { participants, setParticipants } = this.props;

    const data = [...participants];
    data.find(p => p === participant).shiftsQty = newShiftQty;
    setParticipants(data);
  };

  getAdminContactData = adminData => {
    if (!adminData) return {};
    const name = `${adminData.name} (Yo)`;
    const contact = {
      givenName: name,
      displayName: name,
      phoneNumbers: [{ number: adminData.phone }],
    };

    return contact;
  };

  addAdminParticipant = async () => {
    const { auth } = this.state;
    const contact = this.getAdminContactData(auth);
    const { participants } = this.props;
    if (!participants.find(p => p === contact))
      this.addParticipant(contact, true);
  };

  addParticipant = (contact, admin = false) => {
    const { participants, setParticipants, participantsQty } = this.props;

    // Check available shift
    const takenShifts =
      participants.length > 0
        ? participants
            .map(e => e.shiftsQty)
            .reduce((sum, shiftsQty) => sum + shiftsQty)
        : 0;
    const totalShifts = participantsQty;

    if (!admin && takenShifts >= totalShifts) {
      this.openModal(
        "¡Alcanzaste el número máximo de participantes de esta Ronda!",
      );
    } else {
      const contactPhoneNumber = contact.phantom
        ? contact.phone
        : contact.phoneNumbers &&
          contact.phoneNumbers.length > 0 &&
          contact.phoneNumbers[0].number;

      if (!contactPhoneNumber && !contact.phantom) {
        this.openModal("El usuario necesita tener un número para ser invitado");
      } else {
        const newContactData = {
          name: contact.displayName,
          phantom: contact.phantom,
          phone: contactPhoneNumber,
          thumbnailPath: contact.thumbnailPath,
          shiftsQty: 1,
          admin,
        };

        const data = [...participants];
        data.push(newContactData);
        const { openedDoubleNumberNotice } = this.state;
        if (!openedDoubleNumberNotice && !newContactData.admin) {
          this.openModal(
            "Si algún participante quiere tener 2 o más números, debés elegirlo la misma cantidad de veces.",
            null,
            <PeopleWithExclamation />,
          );
          this.setState({ openedDoubleNumberNotice: true });
        }
        setParticipants(data);
      }
    }
  };

  prePendAdminContact = async (contacts, adminData) => {
    const admin = this.getAdminContactData(adminData);
    return [admin, ...contacts];
  };

  removeParticipant = contact => {
    const { participants, setParticipants } = this.props;

    const data = [...participants];
    const admin = data.splice(0, 1);

    const index = data.indexOf(contact);

    if (contact.phantom) {
      data.splice(index, 1);
      setParticipants([...admin, ...data]);
      return true;
    }

    const found = data.find(p =>
      p.phantom ? true : p.phone === contact.phone,
    );

    if (found && !found.admin) {
      data.splice(index, 1);
      setParticipants([...admin, ...data]);
    }

    return null;
  };

  showPhantomModal = () => this.setState({ phantomModalVisible: true });

  resetFilter = () => {
    const { fullContactList } = this.state;
    this.setState({ contactList: fullContactList });
  };

  filter = val => {
    const { fullContactList } = this.state;
    const contacts = fullContactList;
    const resContacts = contacts.filter(contact => {
      const { displayName } = { ...contact };
      if (!displayName) return false;
      if (displayName.toLowerCase().includes(val.toLowerCase())) return true;
      return false;
    });
    this.setState({ contactList: resContacts });
  };

  renderContactList = () => {
    const {
      loading,
      contactsPermission,
      contactList,
      shouldRenderContacts,
    } = this.state;
    if (loading) return <Spinner />;
    if (contactsPermission && shouldRenderContacts)
      return (
        <View style={styles.container}>
          <SearchInput
            filter={this.filter}
            resetFilter={this.resetFilter}
            style={{ flex: 1 }}
          />
          <TouchableOpacity onPress={this.showPhantomModal}>
            <Text style={styles.phantomButtonText}>
              ¿Querés agregar a alguien que participará sin app ai·di?
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <ContactList
              contactList={contactList}
              pressHandler={this.addParticipant}
            />
          </View>
        </View>
      );

    return <Text>Necesitamos permisos para acceder a tus contactos</Text>;
  };

  render() {
    const { confirmAlert, phantomModalVisible, auth } = this.state;
    const { participants, shouldRenderNext, handleNext } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {confirmAlert && <ConfirmModal {...confirmAlert} />}
        <View style={styles.container}>
          <SelectedList
            participants={participants}
            pressHandler={this.removeParticipant}
            shiftPressHandler={this.shiftPressHandler}
          />

          {this.renderContactList()}
        </View>
        {shouldRenderNext && <NextButton callback={handleNext} />}

        {phantomModalVisible && (
          <PhantomModal
            addPhantomInvite={this.addPhantomInvite}
            phoneNumber={auth.phone}
            closeModal={() => this.setState({ phantomModalVisible: false })}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
  },
  contactThumbnail: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  phantomButtonText: {
    fontSize: 11,
    color: "#3198b5",
    fontStyle: "italic",
    marginVertical: 10,
    textDecorationLine: "underline",
  },
  searchContainer: {
    flexDirection: "row-reverse",
    width: "90%",
    justifyContent: "center",
    color: colors.mainBlue,
    borderColor: colors.mainBlue,
    borderWidth: 3,
  },
  contactList: {
    flex: 1,
    flexDirection: "row",
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

// make this component available to the app
export default ParticipantList;

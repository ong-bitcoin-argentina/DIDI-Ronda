import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  ScrollView,
} from "react-native";
import { Icon, Button } from "native-base";
import colors from "../colors";
import Avatar from "../Avatar";

class Participants extends React.Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
    this.state = {};
  }

  componentDidUpdate() {
    const { open } = this.props;
    if (open) {
      Animated.timing(this.animation, {
        toValue: 100,
        duration: 300,
      }).start();
    } else {
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 300,
      }).start();
    }
  }

  render() {
    const {
      selectedParticipants,
      participants,
      open,
      selectParticipants,
    } = this.props;

    const contacts = participants.map((contact, i) => {
      let selected = false;
      if (selectedParticipants.includes(contact)) {
        selected = true;
      }

      return (
        <TouchableOpacity
          key={i}
          style={styles.participantIcon}
          onPress={() => {
            const newParticipants = selectedParticipants;

            if (!selected) {
              newParticipants.push(contact);
            } else {
              newParticipants.splice(newParticipants.indexOf(contact), 1);
            }

            if (newParticipants.length > 2) {
              newParticipants.splice(0, 1);
            }

            // TODO: fix that
            this.setState({ selectedParticipants: newParticipants });
          }}
        >
          <Avatar path={contact.thumbnailPath} selected={selected} />

          <Text>{contact.name}</Text>
        </TouchableOpacity>
      );
    });

    const heightInterpolated = this.animation.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 200],
    });

    return (
      <Animated.View
        style={[styles.participantsContainer, { height: heightInterpolated }]}
      >
        <ScrollView
          contentContainerStyle={styles.participantsScroll}
          style={{ width: "100%" }}
          horizontal
        >
          {contacts}
        </ScrollView>
        <View styles={styles.participantsMenuContainer}>
          <Icon style={styles.participantsMenuIcon} name="people" />
          <Text style={styles.selectedParticipantsValue}>
            {selectedParticipants.length}
          </Text>
          {open && (
            <Button
              style={{
                backgroundColor: colors.mainBlue,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
                marginHorizontal: "10%",
              }}
              onPress={() => selectParticipants(selectedParticipants)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Seleccionar
              </Text>
            </Button>
          )}
        </View>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundGray,
  },
  numbersContainer: {
    width: "100%",
    flex: 1,
  },
  number: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundGray,
  },
  participant: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  participantIdentification: {
    flex: 1,
    flexDirection: "column",
  },
  numberFlag: {
    color: colors.mainBlue,
    marginRight: 15,
    fontSize: 40,
  },
  thumbnail: {
    height: 40,
    width: 40,
    marginRight: 15,
  },
  participantName: {
    fontWeight: "bold",
    color: colors.gray,
    fontSize: 22,
  },
  participantNumber: {
    color: colors.secondary,
    fontSize: 18,
  },
  contactThumbnailContainer: { flexDirection: "row", alignItems: "center" },
  contactThumbnail: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },

  participantIcon: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  participantsContainer: {
    width: "100%",
    backgroundColor: "white",
    zIndex: 1,
    justifyContent: "center",
  },
  participantsScroll: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  participantsMenuContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  participantsMenuIcon: { textAlign: "center", color: colors.secondary },
  selectedParticipantsValue: { textAlign: "center", color: colors.mainBlue },
});

export default Participants;

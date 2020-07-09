import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Icon } from "native-base";
import SubMenuContainer from "../roundsCreation/steps/RoundDetail/SubMenuContainer";
import Avatar from "../roundsCreation/steps/ParticipantSelection/Avatar";
import colors from "../../components/colors";

const Number = props => {
  const { pendiente, amount, date: propDate, onPress, name, picture } = props;
  const pendent = pendiente;
  const date = pendent ? new Date(propDate) : "";
  return (
    <TouchableOpacity onPress={onPress} style={styles.participantState}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar path={picture} />
        <View style={{ marginHorizontal: 15 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>
            {pendent &&
              `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
          </Text>
        </View>
      </View>

      <View
        style={{
          justifyConter: "space-between",
          alignItems: "center",
          width: 80,
        }}
      >
        <View
          style={{
            marginBottom: 8,
            borderRadius: 10,
            width: 20,
            height: 20,
            backgroundColor: pendent ? colors.green : colors.yellowStatus,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            type={pendent ? "MaterialIcons" : "FontAwesome"}
            name={pendent ? "attach-money" : "exclamation"}
            style={{ color: pendent ? "white" : "black", fontSize: 18 }}
          />
        </View>
        <Text>{pendent ? `$ ${amount}` : "pendiente"}</Text>
      </View>
    </TouchableOpacity>
  );
};

class ParticipantsList extends Component {
  constructor(props) {
    super(props);

    this._onPress = this._onPress.bind(this);
  }

  _onPress(p) {
    this.props.goToPay(p);
  }

  render() {
    const { pays, participants, amount } = this.props;

    const paidParticipants = pays.map(p => {
      return p.participant;
    });

    const populatedParticipants = participants.map(p => {
      return {
        id: p._id,
        name: p.user.name,
        pendent: paidParticipants.includes(p._id),
        picture: p.user.picture,
        date: paidParticipants.includes(p._id)
          ? pays.filter(pay => pay.participant === p._id)[0].date
          : "nope",
      };
    });
    return (
      <SubMenuContainer title="Estado">
        <FlatList
          data={populatedParticipants}
          contentContainerStyle={styles.FlatList}
          scrollEnabled={false}
          renderItem={data => {
            return (
              <Number
                name={data.item.name}
                picture={data.item.picture}
                amount={amount}
                pendiente={data.item.pendent}
                date={data.item.date}
                onPress={() => this._onPress(data.item)}
              />
            );
          }}
          keyExtractor={data => data.id}
        />
      </SubMenuContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  FlatList: {
    paddingHorizontal: "6%",
  },
  participantState: {
    width: "100%",
    backgroundColor: "white",
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  name: {
    fontWeight: "600",
  },
  date: {
    color: colors.secondary,
    fontSize: 12,
  },
});

export default ParticipantsList;

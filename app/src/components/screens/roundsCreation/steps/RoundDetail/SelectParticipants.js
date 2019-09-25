import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  ScrollView,
  Button,
} from 'react-native';
import colors from '../../../../components/colors';
import {Icon} from 'native-base';
import Avatar from '../../../../../assets/img/avatar.png';

class Participants extends React.Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
    this.state = {
      selectedParticipants: props.selectedParticipants,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open) {
      Animated.timing(this.animation, {
        toValue: this.state.selectedParticipants.length ? 100 : 50,
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
    const contacts = this.props.participants.map((contact, i) => {
      let selected = false;
      if (this.state.selectedParticipants.includes(contact)) {
        selected = true;
      }

      return (
        <TouchableOpacity
          key={i}
          style={styles.participantIcon}
          onPress={() => {
            let participants = this.state.selectedParticipants;

            if (!selected) {
              participants.push(contact);
            } else {
              let index = participants.indexOf(contact);
              participants.splice(index, 1);
            }

            if (participants.length > 2) {
              participants.splice(0, 1);
            }

            this.setState({selectedParticipants: participants});
          }}>
          {contact.hasThumbnail ? (
            <Image
              style={[
                styles.contactThumbnail,
                {marginRight: 0, marginBottom: 10},
                selected && {borderColor: colors.mainBlue, borderWidth: 3},
              ]}
              source={{uri: contact.thumbnailPath}}
            />
          ) : (
            <Image style={styles.contactThumbnail} source={Avatar} />
          )}
          <Text>{contact.givenName}</Text>
        </TouchableOpacity>
      );
    });

    const heightInterpolated = this.animation.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 200],
    });

    return (
      <Animated.View
        style={[styles.participantsContainer, {height: heightInterpolated}]}>
        <ScrollView
          contentContainerStyle={styles.participantsScroll}
          style={{width: '100%'}}
          horizontal={true}>
          {contacts}
        </ScrollView>
        {this.state.selectedParticipants.length > 0 && (
          <View styles={styles.participantsMenuContainer}>
            <Icon style={styles.participantsMenuIcon} name="people"></Icon>
            <Text style={styles.selectedParticipantsValue}>
              {this.state.selectedParticipants.length}
            </Text>
            {this.props.open && (
              <Button
                onPress={() => {
                  this.props.selectParticipants(
                    this.state.selectedParticipants,
                  );
                }}
                title={'Seleccionar'}></Button>
            )}
          </View>
        )}
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  numbersContainer: {
    width: '100%',
    flex: 1,
  },
  number: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundGray,
  },
  participant: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  participantIdentification: {
    flex: 1,
    flexDirection: 'column',
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
    fontWeight: 'bold',
    color: colors.gray,
    fontSize: 22,
  },
  participantNumber: {
    color: colors.secondary,
    fontSize: 18,
  },
  contactThumbnailContainer: {flexDirection: 'row', alignItems: 'center'},
  contactThumbnail: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 12,
  },

  participantIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  participantsContainer: {
    width: '100%',
    backgroundColor: 'white',
    zIndex: 1,
    justifyContent: 'center',
  },
  participantsScroll: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  participantsMenuContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantsMenuIcon: {textAlign: 'center', color: colors.secondary},
  selectedParticipantsValue: {textAlign: 'center', color: colors.mainBlue},
});

export default Participants;

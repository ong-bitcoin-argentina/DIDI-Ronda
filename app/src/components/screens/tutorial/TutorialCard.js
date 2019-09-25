import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {View, Text} from 'native-base';

const TutorialCard = props => {
  if (props.item.placeholder) {
    return <View></View>;
  }

  return (
    <View style={[styles.cardContainer, {height: props.height}]}>
      <Image style={styles.image} source={props.item.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{props.item.title}</Text>
        <View style={styles.container}>
          <Text style={styles.text}>{props.item.text}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 21,
    marginTop: 35,
    marginBottom: 20,
  },
  text: {
    color: 'rgba(0,0,0,0.7)',
    textAlign: 'center',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  body: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    padding: 30,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
});

export default TutorialCard;

import React, {Component, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {View, DeckSwiper, Text, Icon, Spinner} from 'native-base';
import {Dimensions} from 'react-native';
import Colors from '../../components/colors';
import TutorialCard from './TutorialCard';
import DotStepCounter from './DotStepCounter';
import {getInset} from 'react-native-safe-area-view';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../../components/colors';
import Carousel from 'react-native-snap-carousel';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const CARDS_HEIGHT =
  SCREEN_HEIGHT > 620 ? SCREEN_HEIGHT * 0.65 : SCREEN_HEIGHT * 0.75;

const topOffset = getInset('top');

const cards = [
  {
    title: 'Empezá a jugar',
    text: 'Invitá a jugar sólo a gente que conozcas y sea de tu confianza.',
    image: require('../../../assets/img/tutorial-pic1.jpg'),
    placeholder: false,
  },
  {
    title: '¿Qué tenés que hacer?',
    text: 'Indicá cuánto aporta cada uno y con qué frecuencia.',
    image: require('../../../assets/img/tutorial-pic2.jpg'),
    placeholder: false,
  },
  {
    title: 'Sorteo o elección grupal',
    text:
      'El órden de ganadores puede ser por sorteo o por elección colaborativa del grupo.',
    image: require('../../../assets/img/tutorial-pic3.jpg'),
    placeholder: false,
  },
  {
    title: 'Sorteo o elección grupal',
    text:
      'El órden de ganadores puede ser por sorteo o por elección colaborativa del grupo.',
    image: require('../../../assets/img/tutorial-pic3.jpg'),
    placeholder: true,
  },
];
getTutorialState = async (callback, secondCalback) => {
  try {
    const value = await AsyncStorage.getItem('tutorialFinished');
    if (value !== null) {
      callback();
    } else {
      secondCalback(false);
    }
  } catch (error) {
    return false;
  }
};

const Tutorials = props => {
  const [step, nextStep] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTutorialState(() => {
      props.navigation.navigate('Main');
    }, setLoading);
  }, []);

  handleSwipe = count => {
    if (count >= cards.length) {
      goToHome();
    } else {
      nextStep(count);
    }
  };

  goToHome = async () => {
    try {
      await AsyncStorage.setItem('tutorialFinished', 'true');
    } catch (error) {}
    props.navigation.navigate('Home');
  };
  _renderItem = ({item, index}) => {
    return <TutorialCard height={CARDS_HEIGHT} item={item} />;
  };
  closeButton = (
    <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => goToHome()}>
      <Text style={styles.closeButton}>Cerrar </Text>
      <Icon style={{color: 'white'}} name="ios-close"></Icon>
    </TouchableOpacity>
  );

  return loading ? (
    <View style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Spinner color={'white'} />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.closeButtonContainer}>{closeButton}</View>

      <View style={styles.deckSwiperContainer}>
        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={cards}
          renderItem={this._renderItem}
          sliderWidth={SCREEN_WIDTH}
          itemWidth={SCREEN_WIDTH}
          onSnapToItem={i => {
            nextStep(i);
          }}
          onBeforeSnapToItem={i => {
            i == cards.length - 1 && goToHome();
          }}
        />
      </View>
      <View style={styles.dotStepCounterContainer}>
        <DotStepCounter items={cards} count={step} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dotStepCounterContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 50,
  },
  deckSwiperContainer: {
    height: CARDS_HEIGHT,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 11,
    },
    width: '100%',
    shadowOpacity: 0.55,
    shadowRadius: 14.78,
    elevation: 22,
  },
  closeButton: {fontSize: 20, color: 'white'},
  closeButtonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.mainBlue,
    marginTop: topOffset,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '8%',
  },
  container: {
    backgroundColor: Colors.mainBlue,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
});

export default Tutorials;

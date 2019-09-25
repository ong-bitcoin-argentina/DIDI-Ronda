import React from 'react';
import {View} from 'react-native';
import {Text, Icon, Button} from 'native-base';
import Colors from '../../components/colors';
import {createSwitchNavigator, createStackNavigator} from 'react-navigation';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import RoundCreation from '../roundsCreation/RoundCreation';
import RoundsList from './RoundsList';
import RoundDetail from '../RoundDetail';
import NumberDetail from '../NumberDetail';
import UserProfile from '../UserProfile';

const List = createStackNavigator({
  List: {
    screen: RoundsList,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Ronda`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <Menu>
          <MenuTrigger>
            <View style={{paddingRight: 20}}>
              <Icon name="md-more" style={{color: 'white'}} />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Compartido!`)}>
              <Text style={{fontSize: 16, color: Colors.gray}}>Compartir</Text>
            </MenuOption>
            <MenuOption onSelect={() => alert(`Documentos`)}>
              <Text style={{fontSize: 16, color: Colors.gray}}>
                Ver Documentos
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => alert(`Pagado!`)}
              disabled={true}
              text="Pagar"
            />
          </MenuOptions>
        </Menu>
      ),
    }),
  },
  NumberDetail: {
    screen: NumberDetail,
    navigationOptions: () => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      title: `Numero`,
      headerTintColor: 'white',
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerRight: (
        <Menu>
          <MenuTrigger>
            <View style={{paddingRight: 20}}>
              <Icon name="md-more" style={{color: 'white'}} />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Compartido!`)}>
              <Text style={{fontSize: 16, color: Colors.gray}}>Compartir</Text>
            </MenuOption>
            <MenuOption onSelect={() => alert(`Documentos`)}>
              <Text style={{fontSize: 16, color: Colors.gray}}>
                Ver Documentos
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => alert(`Pagado!`)}
              disabled={true}
              text="Pagar"
            />
          </MenuOptions>
        </Menu>
      ),
    }),
  },
  RoundDetail: {
    screen: RoundDetail,
    navigationOptions: ({navigation}) => ({
      headerBackTitle: null,
      headerBackStyle: {color: 'white'},
      headerTintColor: 'white',
      title: `Mis Rondas`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerLeft: (
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon style={{color: '#fff'}} name="arrow-back" />
        </Button>
      ),
      headerRight: (
        <Menu>
          <MenuTrigger>
            <View style={{paddingRight: 20}}>
              <Icon name="md-more" style={{color: 'white'}} />
            </View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Compartido!`)}>
              <Text style={{fontSize: 16, color: Colors.gray}}>Compartir</Text>
            </MenuOption>
            <MenuOption onSelect={() => alert(`Documentos`)}>
              <Text style={{fontSize: 16, color: Colors.gray}}>
                Ver Documentos
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => alert(`Pagado!`)}
              disabled={true}
              text="Pagar"
            />
          </MenuOptions>
        </Menu>
      ),
    }),
  },
  UserProfile: {
    screen: UserProfile,
    navigationOptions: ({navigation}) => ({
      title: `Usuario`,
      headerStyle: {backgroundColor: '#417fd7'},
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
      headerLeft: (
        <Button transparent onPress={() => navigation.goBack()}>
          <Icon style={{color: '#fff'}} name="arrow-back" />
        </Button>
      ),
    }),
  },
});

export default createSwitchNavigator({
  List: {
    screen: List,
  },
  Create: {
    screen: RoundCreation,
  },
  headerMode: 'none',
});

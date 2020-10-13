import React from 'react';
import {
  Text,
  StyleSheet,
  SectionList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import * as UserService from '../../../services/api/user';
import moment from 'moment';
import Notification from './Notification';
import { getAuth } from '../../../utils/utils';
import colors from '../../components/colors';

const aWeekAgo = moment().subtract(7, 'days');

const isRecent = date => {
  const myDate = moment(date);
  return myDate.isAfter(aWeekAgo);
};

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recent: [],
      old: [],
      loading: true,
    };
  }

  static navigationOptions = {
    tabBarOptions: {
      showLabel: true,
    },
  };

  componentDidMount(props) {
    this.getNotifications();
  }

  getNotifications = async () => {
    const user = await getAuth();
    if (user) {
      const { username } = user;
      try {
        const response = await UserService.getNotifications(username);
        const { items } = response.data;
        this.setState({
          recent: items.filter(item => isRecent(item.date)),
          old: items.filter(item => !isRecent(item.date)),
          loading: false,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator
            size="large"
            color={colors.mainBlue}
            style={styles.loader}
          />
        ) : (
          <SectionList
            sections={[
              { title: 'Esta Semana', data: this.state.recent },
              { title: 'Anteriores', data: this.state.old },
            ]}
            renderSectionHeader={({ section }) => (
              <Text style={styles.title}>{section.title}</Text>
            )}
            headerTitleStyle={styles.title}
            renderSectionFooter={({ section }) =>
              !section.data.length && <Text>No se encontraron resultados.</Text>
            }
            renderItem={({ item }) => <Notification notification={item} />}
            keyExtractor={(item, index) => item + index}
            numColumns={1}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={30}
            windowSize={9}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  card: {
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10,
    padding: 5,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#24CDD2',
    borderRadius: 8,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    marginTop: 90,
  },
});

export default createStackNavigator({
  Notifications: {
    screen: Notifications,
    navigationOptions: () => ({
      title: `Notificaciones`,
      headerStyle: { backgroundColor: '#417fd7' },
      headerTitleStyle: {
        color: 'white',
        width: '80%',
        textAlign: 'left',
        fontSize: 18,
      },
    }),
  },
});

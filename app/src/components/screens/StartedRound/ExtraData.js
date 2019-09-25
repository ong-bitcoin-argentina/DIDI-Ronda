//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../components/colors';
import {Icon} from 'native-base';

export default ExtraData = props => {
  let frequency = '';
  switch (props.frequency) {
    case 'm':
      frequency = 'Mensual';
      break;
    case 'q':
      frequency = 'Quincenal';
      break;
    case 's':
      frequency = 'Semanal';
      break;
  }
  return (
    <View style={styles.roundInfo}>
      <View style={styles.roundInfoDates}>
        <View style={styles.roundInfoDate}>
          <Icon
            type="MaterialCommunityIcons"
            name="calendar-range"
            style={styles.smallIcon}
          />
          <View>
            <Text style={styles.date}>{props.startDate}</Text>
            <Text style={styles.dateSubtitle}>Inicio</Text>
          </View>
        </View>
        <Icon
          type="MaterialCommunityIcons"
          name="arrow-right"
          style={{color: Colors.secondary}}></Icon>
        <View style={styles.roundInfoDate}>
          <Icon
            type="MaterialCommunityIcons"
            name="calendar-range"
            style={styles.smallIcon}
          />
          <View>
            <Text style={styles.date}>{props.endDate}</Text>
            <Text style={styles.dateSubtitle}>Fin</Text>
          </View>
        </View>
      </View>
      <View style={styles.roundInfoDates}>
        <View style={styles.roundInfoDate}>
          <Icon
            type="MaterialIcons"
            name="access-alarm"
            style={styles.smallIcon}
          />
          <View>
            <Text style={styles.date}>{frequency}</Text>
            <Text style={styles.dateSubtitle}>Frecuencia</Text>
          </View>
        </View>

        <View style={styles.roundInfoDate}>
          <Icon type="FontAwesome" name="money" style={styles.smallIcon} />
          <View>
            <Text style={styles.date}>
              ${Math.floor(props.amount / props.shifts)}
            </Text>
            <Text style={styles.dateSubtitle}>Aporte</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundGray,
  },
  scrollView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    margin: 15,
  },
  titleContainer: {
    height: '10%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundGray,
  },
  dataRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingHorizontal: 20,
    color: Colors.gray,
    fontSize: 18,
    fontWeight: 'bold',
  },

  roundStatus: {
    height: '100%',
    width: 5,
  },
  roundData: {
    width: '95%',
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: Colors.mainBlue,
  },
  icon: {
    backgroundColor: Colors.mainBlue,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  roundNameContainer: {
    marginHorizontal: 10,
    width: '40%',
  },
  column: {
    flexDirection: 'column',
  },
  mensuality: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
    color: Colors.lightBlue,
  },
  amount: {
    textAlign: 'right',
    color: 'white',
  },
  roundUsers: {
    color: 'white',
  },
  roundName: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 14,
  },
  rightActionContainer: {
    marginHorizontal: 15,
    marginVertical: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  rightAcionButton: {
    flex: 1,
    borderRadius: 0,
    margin: 0,
    width: '100%',
  },
  rightAcionIcon: {
    color: 'white',
  },
  roundInfo: {
    flexDirection: 'column',
    height: 100,
    marginBottom: 8,
    backgroundColor: 'white',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  roundInfoDate: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
  },
  date: {fontSize: 12, fontWeight: '600'},
  dateSubtitle: {fontSize: 11, color: Colors.secondary},
  smallIcon: {color: Colors.mainBlue, fontSize: 22, marginRight: 10},
  roundState: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 20,
  },
  state: {
    color: Colors.lightBlue,
    fontStyle: 'italic',
  },
  roundInfo: {
    flexDirection: 'column',
    height: 100,
    marginBottom: 8,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  roundInfoDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: '5%',
  },
  roundInfoDate: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '35%',
  },
  date: {fontSize: 12, fontWeight: '400'},
  dateSubtitle: {fontSize: 11, color: Colors.secondary},
  smallIcon: {color: Colors.mainBlue, fontSize: 22, marginRight: 10},
  roundState: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingRight: 20,
  },
});

//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
} from 'react-native';
import Colors from '../../components/colors';
import {Icon} from 'native-base';
import Number from '../roundsCreation/steps/NumbersAsign/Number';

export default Header = props => {
  return (
    <View style={styles.roundData}>
      <View style={styles.dataColumn}>
        <View style={styles.dataRow}>
          <View style={styles.icon}>
            <Icon
              type="MaterialIcons"
              name="filter-tilt-shift"
              style={{color: 'white'}}
            />
          </View>
          <View style={styles.roundNameContainer}>
            <Text numberOfLines={1} style={styles.roundName}>
              {props.name}
            </Text>
          </View>
        </View>
        <View style={styles.dataRow}>
          <View style={styles.icon}>
            <Icon
              type="MaterialIcons"
              name="bookmark-border"
              style={{color: 'white', fontSize: 22}}
            />
          </View>
          <Text style={styles.amount}>0 de {props.paymentsQty}</Text>
        </View>
      </View>
      <View style={styles.dataColumn}>
        <View style={styles.dataRow}>
          <View style={styles.icon}>
            <Icon
              type="MaterialIcons"
              name="attach-money"
              style={{color: 'white'}}
            />
          </View>
          <View style={styles.roundNameContainer}>
            <Text numberOfLines={1} style={styles.roundName}>
              ${props.amount}
            </Text>
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
    height: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  dataColumn: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
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
    height: 100,
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
  date: {fontSize: 12, fontWeight: '400'},
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

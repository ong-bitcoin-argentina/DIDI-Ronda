//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../../../components/colors';

// create a component
class SubMenuContainer extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.title}</Text>
        {this.props.children}
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: Colors.backgroundGray,
    paddingVertical: 10,
  },
  title: {
    color: Colors.mainBlue,
    fontSize: 12,
    fontWeight: '500',
    margin: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
});

//make this component available to the app
export default SubMenuContainer;

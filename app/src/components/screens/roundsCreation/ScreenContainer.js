import React from 'react';
import {View, StyleSheet, Text, KeyboardAvoidingView} from 'react-native';
import colors from '../../components/colors';
import StepCounter from './StepCounter';

export default class ScreenContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={styles.screenContainer}
        behavior="padding"
        enabled>
        <View style={styles.screenContainer}>
          <StepCounter totalSteps={7} curentStep={this.props.step + 1} />
          {this.props.title != null && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{this.props.title}</Text>
            </View>
          )}
          {this.props.children}
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  screenContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  titleContainer: {
    flex: 0.2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundGray,
  },
  title: {
    paddingHorizontal: 20,
    color: colors.gray,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

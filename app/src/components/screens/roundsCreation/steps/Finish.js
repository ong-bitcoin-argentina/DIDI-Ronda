import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {Text, Spinner, Icon, Button} from 'native-base';
import ScreenContainer from '../ScreenContainer';
import colors from '../../../components/colors';
import {connect} from 'react-redux';

class Finish extends Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);
  }

  componentDidUpdate(prevProps, prevState) {
    const prevLoading = prevProps.loading;
    const prevError = prevProps.error;

    const {loading, error} = this.props;

    if (prevLoading === true && loading === false) {
      if (error === null) {
        // Success!
        Animated.timing(this.animation, {
          toValue: 100,
          duration: 2000,
        }).start();
        setTimeout(() => {
          this.props.navigation.navigate('List');
        }, 2000);
      } else {
        // Error!
      }
    }
  }

  render() {
    const {loading, error, createdRound} = this.props;

    const widthInterpolated = this.animation.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
      extrapolate: 'clamp',
    });

    return (
      <ScreenContainer title={''} step={5}>
        <View style={styles.container}>
          {loading ? (
            <Spinner color={colors.mainBlue} style={styles.spinner} />
          ) : error ? (
            <View>
              <Icon
                name="close-circle-outline"
                type="MaterialCommunityIcons"
                style={styles.errorIcon}></Icon>
              <Text style={styles.errorText}>
                Hubo un error, intente nuevamente
              </Text>
              <Button
                onPress={() => {
                  this.props.navigation.navigate('RoundName');
                }}
                style={styles.errorButton}>
                <Text style={styles.errorButtonText}>Volver a intentar</Text>
              </Button>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <Icon
                name="check-circle-outline"
                type="MaterialCommunityIcons"
                style={styles.succesIcon}></Icon>
              <Text style={styles.successText}>
                {createdRound.name} creada con éxito!
              </Text>
              <Text style={styles.successSubtext}>
                Redirigiendo a la lista...
              </Text>
              <View style={{flex: 1}}>
                <Animated.View
                  style={[styles.progressBar, {width: widthInterpolated}]}
                />
              </View>
            </View>
          )}
        </View>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGray,
    flex: 1,
    alignItems: 'center',
  },
  spinner: {
    flex: 1,
  },
  succesIcon: {
    fontSize: 100,
    color: 'green',
    textAlign: 'center',
  },
  successText: {
    fontSize: 20,
    textAlign: 'center',
  },
  successSubtext: {
    textAlign: 'center',
    marginTop: 10,
  },
  errorIcon: {
    fontSize: 100,
    color: 'red',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
  },
  errorButtonText: {
    textAlign: 'center',
    flex: 1,
  },
  progressBar: {
    height: 2,
    marginTop: 10,
    backgroundColor: colors.mainBlue,
  },
});

const mapDispatchToProps = dispatch => {
  return {};
};
const mapStateToProps = state => {
  return {
    loading: state.roundCreation.request.loading,
    error: state.roundCreation.request.error,
    createdRound: state.roundCreation.request.createdRound,
  };
};

export default connect(
  mapStateToProps,
  null,
)(Finish);

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from 'react-native';
import { Text, Spinner, Icon } from 'native-base';
import colors from '../../../components/colors';
import * as roundsActions from '../../../../actions/rounds';
import RoundPopUp from '../../../components/RoundPopUp';
import Avatar from '../../../components/Avatar'
import {connect} from 'react-redux';

const AcceptPaymentPopUp = props => {

    const { roundId, number, roundName, participant } = props;

    const _pay = () => props._pay()

    return (
        <RoundPopUp
            onRef={ props.onRef }
            titleText={ roundName }
            icon={ <Icon type="FontAwesome" name="money" style={ styles.popupIcon } /> }
            positive={ () => _pay() }
            positiveTitle="Aceptar Aporte" 
            negative={ () => {} }
            negativeTitle="Rechazar Aporte" >

            <View style={{width:'100%', justifyContent: 'center', alignItems: 'center',  flexDirection: 'column'}}>
                
                <Text style={ styles.textChilds }>{ `Aceptas el pago que te esta queriendo realizar @${participant.name}?` }</Text>
                <View style={{width:'100%', marginVertical: 20, justifyContent: 'center', alignItems: 'center',  flexDirection: 'column'}}>
                    
                  <Avatar path={participant.picture}/>
                
                </View>
            </View>

        </RoundPopUp>
    )
}

const styles = StyleSheet.create({
    popupIcon: {
        color: colors.mainBlue,
        fontSize: 42,
    },
    textChilds: {
        textAlign: 'center',
        fontSize: 17,
        width: '100%'
    }
});

const mapStateToProps = state => {
  return {
    numberDetails: state.rounds.numberDetails,
    loading: state.rounds.numberDetails.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pay_round: ( roundId, number, participantId ) => {
        dispatch(roundsActions.payRound( roundId, number, participantId ));
      },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AcceptPaymentPopUp);

import React from "react";
import { View } from 'react-native';
import {Text, Spinner} from 'native-base';
import {connect} from 'react-redux';
import CreatedRound from '../CreatedRound';
import StartedRound from '../StartedRound';


const RoundDetail = props => {

    const { requestRounds } = props;
    const reduxRoundObject = !requestRounds.loading && requestRounds.list.find( e => e._id === props.navigation.getParam('_id', null) )

    return (
        !reduxRoundObject || requestRounds.loading ?
            <View style={{flex:1}}>
                <Spinner /> 
            </View>
        : 
            reduxRoundObject.start ?
            <StartedRound {...props} round={ reduxRoundObject } /> :
            <CreatedRound {...props} round={ reduxRoundObject } /> 
    )
}


const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
  };
};

export default connect(mapStateToProps, null)(RoundDetail)

import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import {Text, Spinner} from 'native-base';
import {connect} from 'react-redux';
import CreatedRound from '../CreatedRound';
import StartedRound from '../StartedRound';
import { getAuth } from '../../utils';


const RoundDetail = props => {

    const [auth, setAuth] = useState(null);

    const { requestRounds } = props;
    const reduxRoundObject = !requestRounds.loading && requestRounds.list.find( e => e._id === props.navigation.getParam('_id', null) )


    useEffect( () => {

      const checkAdmin = async () => {
        const auth = await getAuth();
        setAuth( auth )
      }

      checkAdmin()

    }, []);


    return (
        !reduxRoundObject || requestRounds.loading || auth === null ?
            <View style={{flex:1, justifyContent: 'center'}}>
                <Spinner /> 
            </View>
        : 
            reduxRoundObject.start ?
            <StartedRound {...props} round={ reduxRoundObject } auth={ auth } /> :
            <CreatedRound {...props} round={ reduxRoundObject } auth={ auth } /> 
    )
}


const mapStateToProps = state => {
  return {
    requestRounds: state.rounds.requestRounds,
  };
};

export default connect(mapStateToProps, null)(RoundDetail)

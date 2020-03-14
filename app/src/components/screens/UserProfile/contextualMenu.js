import React from 'react';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Icon, View, Text } from 'native-base';
import { Alert } from 'react-native'
import {connect} from 'react-redux';
import * as roundsActions from '../../../actions/rounds';

import colors from '../../components/colors';

const ContextualMenu = props => {

  const { participant, remove_participant, removeParticipant, remove_clean } = props;

  const removeParticipantHandler = () => {

    Alert.alert(
      'Eliminar participante de la ronda',
      `Realmente quieres eliminar a ${ participant.user.name } de la ronda?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK', 
          onPress: () => remove_participant( participant._id, participant.round )
        },
      ],
      {cancelable: false},
    );

  }

  if( removeParticipant.error !== null ){
    const errorMsg = removeParticipant.error.error.response.data.error;
    let customErrorMsg = "";
    // Error list
    switch ( errorMsg ) {
        case "Cant remove participants from started round":
            customErrorMsg = "No se puede eliminar participantes de una ronda ya iniciada.";
            break;
        case "Cant remove round admin":
            customErrorMsg = "No puedes eliminar al administrador de la ronda.";
            break;
        default:
    }
    remove_clean();
    Alert.alert(`Hubo un error. ${customErrorMsg}`);
  } else {
      const round = removeParticipant.round;
      if( round !== null ){
          Alert.alert('Eliminado con éxito');
          remove_clean();
          props.navigation.navigate('RoundDetail', {'_id': round.data.id} )
      }
  }


  return (
    <Menu>
      <MenuTrigger>
        <View style={{paddingRight: 20}}>
          <Icon name="md-more" style={{color: 'white'}} />
        </View>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={ () => removeParticipantHandler() }>
          <Text style={{fontSize: 16, color: colors.gray}}>Eliminar</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const mapStateToProps = state => {
    return {
        removeParticipant: state.rounds.removeParticipant,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        remove_participant: ( idParticipant, roundId ) => {
            dispatch( roundsActions.removeParticipant( idParticipant, roundId ) );
        },
        remove_clean: () => {
            dispatch( roundsActions.removeClean() );
        },
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(ContextualMenu);
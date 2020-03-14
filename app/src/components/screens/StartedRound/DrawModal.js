import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, PermissionsAndroid, Platform, Alert, Image } from 'react-native';
import {Text, Spinner, Item, Input, Icon} from 'native-base';
import colors from '../../components/colors';
import * as roundsActions from '../../../actions/rounds';
import RoundPopUp from '../../components/RoundPopUp';
import Avatar from '../roundsCreation/steps/SelectParticipants/Avatar';
import WheelOfFortune from 'react-native-wheel-of-fortune';
import CircleArrows from '../../../assets/img/circle-arrows.svg';
import {connect} from 'react-redux';

import Number from '../../components/Number'
import Bookmark from '../../components/Bookmark'



const DrawModal = props => {

    const { onPress, item, round, number, assignParticipant } = props;
    const [wheelWinner, setWheelWinner] = useState(null);
    const [disableRoulette, setDisableRoulette] = useState(false)

    const rewards = round && round.participants.map( e => ({ uri: `https://i.pravatar.cc/300?${e._id}`, index: e._id }) )
    const winner = round && Math.floor( Math.random() * round.participants.length ) + 1;
    const shift = round && round.shifts.find( s => s.number === number );

    const shitDay = shift && new Date(shift.limitDate);

    const winnerParticipant = wheelWinner !== null && round && round.participants.find( p => p._id === wheelWinner );
    
    const numberPay = {
        month: shitDay && shitDay.getUTCMonth()+1,
        day: shitDay && shitDay.getUTCDate(),
    };

    const popUpTitle = winnerParticipant ?
    `Felicitaciones a ${ winnerParticipant.user.name }, que se ha llevado la #${ number }` :
    'Vas a sortear quién se lleva la ronda esta vez.'


    const winnerCallback = value => {
        setWheelWinner( value )

        // Call api -> assign participant to shift
        props.assign_participant( value, round._id, number )
    }

    const acceptPopUp = () => {

        setWheelWinner(null);

        if( assignParticipant.error !== null ){
            const errorMsg = assignParticipant.error.error.response.data.error;
            Alert.alert(`Hubo un error. ${errorMsg}`);
        } else {
            props.load_rounds();
        }

    }
    const positiveAction = () => {
        this.child2._onPress();
        setDisableRoulette(true)
    }

    return (
        <RoundPopUp
            onRef={ref => (this.child = ref)}
            titleText={ popUpTitle }
            icon={ <Bookmark outline={true} number={ number } /> }
            positive={ winnerParticipant ? null : () => positiveAction() }
            accept={ winnerParticipant ? () => acceptPopUp() : null }
            positiveTitle={ winnerParticipant ? "Ok" : "Girar Ruleta" }
            disablePositive={disableRoulette}
            notCloseAfterPositive={ winnerParticipant ? false: true } >
        
            <View style={{ flexDirection:'column', width:'100%'}} >

                <View style={{ height: 300 }}>
                    <WheelOfFortune
                        onRef={ref => (this.child2 = ref)} 
                        rewards={ rewards }
                        knobSize={20}
                        knoobSource={require('../../../assets/img/navigation.png')}
                        borderWidth={0}
                        borderColor={'#fff'}
                        playButton={() => (<CircleArrows width={120} height={120} style={styles.playButton} />) }
                        colors={['#99BAE1', '#73A4D0', '#4C7CBE']}
                        winner={ winner }
                        innerRadius={70}
                        duration={5000}
                        size={300}
                        backgroundColor={'#fff'}
                        getWinner={ (value, index) => winnerCallback( value.index ) }
                    />
                </View>

                <View>
                    <Number 
                        number={ number }
                        calendar={ numberPay }
                        title={ winnerParticipant && winnerParticipant.user.name } 
                        subtitle={ winnerParticipant && "Asignado Sorteo" }
                        avatar={ winnerParticipant && [winnerParticipant.user.picture] } />
                </View>

            </View>



        </RoundPopUp>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leftColumn: {
        alignItems: 'center',
    },
    rightColumn: {
        alignItems: 'center',
    },
    middleColumn: {
        paddingHorizontal: 15,
    },
    textName: {

    },
    playButton: {
        top:20,
        zIndex: 10
    },

});


const mapStateToProps = state => {
    return {
        assignParticipant: state.rounds.assignParticipant,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        assign_participant: ( idParticipant, roundId, shiftNumber ) => {
            dispatch( roundsActions.assignParticipant( idParticipant, roundId, shiftNumber ) );
        },
        load_rounds: () => {
            dispatch( roundsActions.loadRounds() )
        }
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(DrawModal);
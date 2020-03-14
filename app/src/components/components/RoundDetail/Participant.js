import React, { useState, useEffect } from "react";
import {View, ScrollView, StyleSheet} from 'react-native';
import { Button, Spinner } from 'native-base';
import colors from '../colors';

import Period from './Period';
import RoundTitle from './RoundTitle';
import RoundInfo from './RoundInfo';
import InvitationModal from './InvitationModal';
import RequestNumberModal from './RequestNumberModal';


const Participant = props => {

    // Props
    const { round, auth } = props;

    // Hooks
    const [accepted, setAccepted]   = useState( true );
    const [loading, setLoading]     = useState( true );
    const [ show, setShow ]         = useState( {show: false} );

    // Variables
    const userParticipant               = round && round.participants.find( p => p.user._id === auth.id )
    const assignedNumbers               = round && round.shifts.filter( shift => shift.participant.includes( userParticipant._id ) )
    const requestedNumbers              = round && round.shifts.filter( shift => shift.requests.includes( userParticipant._id ) )

    // Mount
    useEffect(() => {

        // Check participant invitation 
        setAccepted( userParticipant.acepted )
        setLoading( false)

        accepted &&
        assignedNumbers.length === 0 && 
        requestedNumbers.length === 0 &&
        _openRequestNumbersModal();

    }, []);

    // Methods
    const _openRequestNumbersModal = () => {
        setShow( {show: true} )
    }

    return (
    <View style={styles.container}>
        
        {
            !accepted && <InvitationModal {...props} />
        }

        {
            <RequestNumberModal {...props} show={ show } />
        }

        {
            loading ?
            <Spinner />
            :
            <ScrollView>
                <View style={ styles.scrollContainer }>

                <RoundTitle title={ round.name } amount={ round.amount } />
                <RoundInfo round={ round } auth={ auth } requestNumber={ _openRequestNumbersModal } />

                </View>
            </ScrollView>
        }
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundGray,
    },
    scrollContainer:{
        paddingHorizontal: 15,
        paddingVertical: 20
    }
});

export default Participant;
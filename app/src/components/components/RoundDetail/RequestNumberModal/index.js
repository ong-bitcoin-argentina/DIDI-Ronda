import React, { useState, useEffect } from 'react';
import {View, StyleSheet, FlatList, Alert} from 'react-native';
import {Text} from 'native-base';
import * as roundsActions from '../../../../actions/rounds';
import {connect} from 'react-redux';

import { dateFormatString, availableNumberForRequest } from '../../../utils';

import RoundPopUp from '../../../components/RoundPopUp';

import Item from './Item';

const RequestNumberModal = props => {

    // Props
    const { round, auth, requestNumbers, request_numbers, request_numbers_clean, show } = props;
    
    // Hooks
    const [ selectedNumbers, setSelectedNumbers ] = useState([]);

    // Show listener
    useEffect(() => {
        show.show && _openModal()
    }, [show]);

    // Variables
    const title = `Ronda ${ round.name }`;
    const numbers = round.shifts.map( 
        shift => {
            const number    = shift.number;
            const date      = dateFormatString( shift.limitDate );
            const available = availableNumberForRequest( shift );
            return { number, date, available } 
        }
    );
    const userParticipant   = round.participants.find( p => p.user._id === auth.id )

    // Methods
    const itemPressHandler = number => {

        const newSelected = selectedNumbers;

        if( newSelected.indexOf( number ) === -1 ) {
            newSelected.push( number )
        } else {
            newSelected.splice( newSelected.indexOf( number ), 1 )
        }

        setSelectedNumbers( [...newSelected] )
    }

    const _requestNumbers = () => {
        if( selectedNumbers.length > 0 )
            request_numbers( userParticipant._id, round._id, selectedNumbers )
        else 
            Alert.alert("Debe seleccionar al menos 1 número");
    }

    const _openModal = () => {
        this.child._openPopUp();
    }

    // Render
    return (
        <RoundPopUp
            onRef={ ref => (this.child = ref) }
            titleText={ title }
            positive={ () => { _requestNumbers() } }
            negative={ () => {} } 
            positiveTitle="Eligir Número/s" 
            negativeTitle="Rechazar"
            notCloseAfterPositive={ true }
        >

            <View style={ styles.container }>

                <View style={ styles.listContainer }>
                    <FlatList
                        scrollEnabled={ false }
                        data={ numbers }
                        keyExtractor={ n => `${n.number}` }
                        style={{height: '100%'}}
                        renderItem={
                            ( {item} ) => {
                                const itemSelected = selectedNumbers.indexOf( item.number ) !== -1;
                                return (
                                    <Item 
                                        item={ item } 
                                        selected={ itemSelected } 
                                        pressHandler={ () => itemPressHandler( item.number ) } 
                                    />
                                )
                            }
                        }
                        extraData={ selectedNumbers }
                    />
                </View>

            </View>

        </RoundPopUp>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 15,
    },
    listContainer: {
        flexDirection: 'row',
        flex: 1,
    }
});

const mapStateToProps = state => {
    return {
        requestNumbers: state.participant.requestNumbers,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        request_numbers: ( idParticipant, roundId, numbers ) => {
            dispatch( roundsActions.requestNumbers( idParticipant, roundId, numbers ) );
        },
        request_numbers_clean: () => {
            dispatch( roundsActions.requestNumbersClean() );
        },
    };
};

export default connect( mapStateToProps, mapDispatchToProps )(RequestNumberModal);
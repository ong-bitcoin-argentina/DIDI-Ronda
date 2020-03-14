
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, StyleSheet } from 'react-native';
import UserData from '../../UserProfile/UserProfileComponent'
import { Text, Tab, Button, Tabs, TabHeading, Toast, Spinner } from 'native-base';
import colors from '../../../components/colors'
import PaymentsList from './PaymentsList';
import { getAuth } from '../../../utils';

import * as roundsActions from '../../../../actions/rounds';
import AcceptPayment from './AcceptPayment';


const NumberPay = (props) => {
    
    const round = props.requestRounds.list.find(
        e => e._id === props.navigation.getParam('roundId', null),
      );

    const number = props.navigation.getParam('number', null);
    const fullParticipant = props.navigation.getParam('participant', null)

    const shift = round.shifts.find(s => s.number == number)
    const shiftParticipantId = shift.participant

    const shiftParticipant = round.participants.find(p => p._id == shiftParticipantId)


    _pay = async () => {

        const participantId = fullParticipant.id

        if(participantId) {

            props.pay_round(round._id, number, participantId)

        }else{ 

            Toast.show({
                text: 'Hubo un problema con el pago intenta mas tarde',
                position: 'top',
                type: 'warning',
            })

        }
    }

    openPopUp = () =>{
      this.popup._openPopUp();
    }


    const participantPaid = shift.pays.filter(p => {
      return p.participant == fullParticipant.id
    }).length > 0

    return (
        <UserData participant={ fullParticipant }>
            <Tabs tabBarUnderlineStyle={ styles.tabHeaderBorder } locked>
                <Tab heading={
                    <TabHeading style={ styles.tabHeader }>
                    <Text style={ styles.tabHeaderText }>APORTES</Text>
                    </TabHeading>
                }>
                  <View style={{width: '100%', backgroundColor: colors.lightGray, justifyContent: 'center', flexDirection: 'column', alignItems: 'center', flex: 1}}>
                      <PaymentsList  participant={ fullParticipant } amount={ round.amount / round.shifts.length } round={round} currentShift={shift} shifts={ round.shifts }/>
                      <View style={{width:'90%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                          <Image style={{width: 200, height: 200, marginVertical: 15}} source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAC6CAMAAAAu0KfDAAAABlBMVEX///8AAABVwtN+AAABxklEQVR4nO3QUZKDQAwD0eT+l94DgJQeCAXOtr4oGKzneb2MMebivHHSX31mbzljkC5d+hT6tj6dIcuQ+vRMDNKlS59I5zX9ZKKQ98QgXbr0X6X3f9P5NEG6dOnSSTGnk6/SpUv/PXrHEXpHHLsa6dKlT6cfq/nuMzdIly59Cv18SMGF9Wci/Y5IvyM301N9quxEshJZAy0sXbr0x9NJWRqXWH2NnnQR0qVLn0XvUL79KqVfFmmULl36FHpC9xBoByFi+ipduvQh9D4ivUllqwvwq5EuXfpEOjoK6NsJxy6iLyxduvRZ9M4lX8mSx7rieenSpQ+hry6z/TdVrl5E/1e6dOmz6H2B/kyI6TmtmhaLy0iXLv3B9FXWauXq5NSyE+nSpT+enupTyEoESto/oKVLl/54emKREemvPqf/tWCQLl36EHpfKYWc54vxLunSpU+hr2Zbn3Dkfb+yPkG6dOnPp79xTtWErmPXIV269Fn0nQ/hTHomK5FeflK6dOmz6O9N+Lgz6/XsoKVLl/6j9PS1V/LFert06dL/A31nUM13J0iXLn0inRfz9JnbM/3ipEuXPpF+DEGInN5bpEuXPpFujDEX5A/WVTvF1c+o+gAAAABJRU5ErkJggg=='}} width={200} height={200}></Image>
                          <Button onPress={openPopUp} disabled={participantPaid} style={styles.payButton}>
                            { props.loading ? <Spinner color="white"/> : <Text>{participantPaid ? "Ya se pagó" : "Aceptar Pago"}</Text>}
                          </Button>
                      
                      </View>
                    </View>
                </Tab>
                <Tab disabled heading={
                    <TabHeading style={ styles.emptyHeader }>
                    <Text style={ styles.tabHeaderText }></Text>
                    </TabHeading>
                }>
                    <Text></Text>
                </Tab>
                <Tab disabled heading={
                    <TabHeading style={ styles.emptyHeader }>
                    <Text style={ styles.tabHeaderText }></Text>
                    </TabHeading>
                }>
                </Tab>
            </Tabs>
            <AcceptPayment participant={fullParticipant} _pay={_pay} onRef={ ref => (this.popup = ref) }/>
        </UserData>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    tabHeader: {
        backgroundColor: colors.secondaryBackground,
      },
      emptyHeader: {
        backgroundColor: colors.secondaryBackground
      },
      tabHeaderText: {
        color: '#333',
        fontSize: 12
      },
      tabHeaderBorder: {
        borderBottomWidth: 3, 
        borderColor: colors.mainBlue,
        backgroundColor: colors.secondaryBackground,
      },
      payButton: {
        width: '85%',
        justifyContent: 'center',
        borderRadius: 8,
        marginBottom: 20,
        backgroundColor: colors.mainBlue
      },
});




const mapStateToProps = state => {
    return {
      requestRounds: state.rounds.requestRounds,
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
  )(NumberPay);
  

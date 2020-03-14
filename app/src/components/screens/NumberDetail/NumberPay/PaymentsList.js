import React, { Component } from 'react';

import { View, Text, FlatList, StyleSheet } from 'react-native';
import colors from '../../../components/colors';
import { Icon } from 'native-base';


const PaymentsList = (props) => {


    _renderItem = ({item}) => {
        const date = new Date(item.date)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()

        return(
            <View style={{backgroundColor: 'white', width: '100%', height: 50, justifyContent: 'space-between', alignItems: 'center', alignItems: 'center', flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 50}}>
                    <View
                        style={{
                        borderRadius: 10,
                        width: 20,
                        height: 20,
                        backgroundColor: !item.unpaid ? colors.green: colors.yellowStatus,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Icon
                        type={item.unpaid ? 'FontAwesome' : 'MaterialIcons'}
                        name={item.unpaid ? 'exclamation' : 'attach-money'}
                        style={{color: item.unpaid  ? 'black' : 'white', fontSize: 18}}></Icon>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <Icon
                        type={'FontAwesome'}
                        name={'calendar'}
                        style={{fontSize: 18, color: colors.mainBlue, marginHorizontal: 10}}></Icon>
                        <Text>{`${day}/${month}/${year}`}</Text>
                    </View>

                </View>

                <Text style={{color: item.unpaid ? colors.mainBlue : 'black', fontWeight: 'bold'}}>{` ${item.unpaid ? '- ' : ''}$${props.amount}`}</Text>

            </View>)
    }


    const { participant, shifts, currentShift, round} = props;

    const paymentsDone = [];

    for(shift of shifts){   

        const payments = shift.pays;

        let paid = false
        for ( payment of payments ) {
            if( payment.participant === participant.id ) {
                
                paymentsDone.push( payment );
                paid = true
            
            }

        }
        if (!paid) {

            const unpaidShift = {

                unpaid: true,
                amount: shift.amount,
                date: shift.limitDate
    
            }
            paymentsDone.push( unpaidShift );

            paid = false
        }


        if(shift === currentShift){
            break;
        }

    }


    const date = new Date(currentShift.limitDate)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const participantPaid = currentShift.pays.filter(p => {
        return p.participant == participant.id
    }).length > 0

    return (
        <View style={styles.container}>
            <View style={{backgroundColor: 'white', borderTopLeftRadius: 8, borderTopRightRadius: 8, padding: 12, width: '90%', marginTop: 20}}>
                <View style={{paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', borderBottomColor: colors.secondary, borderBottomWidth: 2}}>
                    <View style={{flexDirection: 'row', justfityContent: 'center', alignItems: 'center'}}>
                        <View style={styles.icon}>
                            <View
                            style={{
                                backgroundColor: participantPaid ? colors.mainBlue : colors.yellowStatus ,
                                height: 14,
                                width: 14,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 7,
                                position: 'absolute',
                                top: -2,
                                right: -2,
                            }}>
                            <Icon
                                type="FontAwesome"
                                name={participantPaid ? "check" : "exclamation"}
                                style={{color:participantPaid ? 'white' : 'black', fontSize: 10}}
                            />
                            </View>
                        <Icon
                            type="MaterialIcons"
                            name="filter-tilt-shift"
                            style={{color: 'white'}}
                        />
                        </View>


                        <View style={{marginHorizontal: 10}}>
                            <Text style={{fontWeight: 'bold'}}>{round.name}</Text>
                            <Text>{`${day}/${month}/${year}`}</Text>
                        </View>
                    </View>

                    <View style={{flexDirection: "column", alignItems: 'flex-end'}}>
                        <Text style={{fontWeight: 'bold', color: colors.mainBlue}}>$ {round.amount}</Text>
                        <Text>- ${props.amount}</Text>
                    </View>
                </View>


            <FlatList data={paymentsDone} renderItem={_renderItem}>
            </FlatList>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
    },
    icon: {
        backgroundColor: colors.mainBlue,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
      },
});

export default PaymentsList;

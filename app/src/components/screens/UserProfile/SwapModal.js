import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, FlatList, PermissionsAndroid, Platform, Alert } from 'react-native';
import {Text, Spinner, Item, Input, Icon} from 'native-base';
import colors from '../../components/colors';
import RoundPopUp from '../../components/RoundPopUp';
import SwapArrow from '../../../assets/img/swap-arrow.svg';

import Avatar from '../roundsCreation/steps/SelectParticipants/Avatar';

import ContactList from './ContactList';

const SwapModal = props => {

    const { title, onPress, from, to } = props;

    return (
        <RoundPopUp
            onRef={ref => (this.child = ref)}
            titleText={ title }
            icon={ <Icon type="MaterialCommunityIcons" name='alert' style={{color: colors.mainBlue, fontSize: 60}} /> }
            positive={() => { onPress() }}
            negative={() => {}} 
            positiveTitle="Reemplazar" >
        
            <View style={ styles.container }>
                <View style={ styles.leftColumn }>
                    <Avatar path={ from && from.picture } />
                    <Text style={ styles.textName }>{ from && from.name.split(' ')[0] }</Text>
                </View>
                <View style={ styles.middleColumn }>
                    <SwapArrow height={'100%'} width={120} />
                </View>
                <View style={ styles.rightColumn }>
                    <Avatar path={ to && to.thumbnailPath } />
                    <Text style={ styles.textName }>{ to && to.displayName.split(' ')[0]  }</Text>
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

    }
});

export default SwapModal;
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'native-base';

import Bookmark from '../../Bookmark';
import colors from '../../colors';



const Item = props => {

    // Props
    const { item, pressHandler, selected } = props;

    const { number, date, available } = item;

    // Render
    return (
        available ?
        <TouchableOpacity 
        style={[ 
            styles.container, 
            selected && { borderLeftWidth: 5, backgroundColor: colors.backgroundGray },
            selected && styles.shadow 
        ]} 
        onPress={ pressHandler }
        >
        <Bookmark number={ number } />
        <Text style={ styles.text } >{ date }</Text>
        </TouchableOpacity>
        :
        <View style={[ styles.container, styles.notAvailable ]}>
            <Bookmark number={ number } bgColor={ colors.textDisabled } />
            <View>
                <Text style={[ styles.text, styles.notAvailableText ]} >{ date }</Text>
                <Text style={ styles.secondaryText }>Ya solicitado / Asignado</Text>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderColor: colors.mainBlue,
        marginVertical: 10,
        marginRight: 10
    },
    notAvailable: {

    },
    text: {
        fontSize: 19
    },
    notAvailableText: {
        color: colors.textDisabled
    },
    secondaryText: {
        fontSize: 12,
        color: colors.secondaryText
    },
    textContainer: {
        flexGrow: 1,
        alignItems: 'center'
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    }
});

export default Item;
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Spinner, Icon} from 'native-base';
import colors from '../../components/colors';
import { amountFormat } from '../../utils';

const RoundTitle = props => {

    const { title, amount } = props;

    const formatedAmount = amount && amountFormat( amount );

    return (
        <View style={ styles.container }>

            <View style={ styles.nameContainer }>
                <Icon style={ styles.icon } type="MaterialIcons" name="filter-tilt-shift" />
                <Text style={[ styles.text, styles.titleText ]}>{ title }</Text>
            </View>
            
            <View style={ styles.amountContainer }>
                <View>
                    <Icon style={ styles.icon } type="MaterialIcons" name="attach-money" />
                </View>

                <View>
                    <Text style={[ styles.text, styles.amountText ]}>{ formatedAmount }</Text>
                    <Text style={[ styles.text, styles.descText ]}>Ronda</Text>
                </View>
            </View>
            
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBlue,
        borderRadius: 5,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameContainer: {
        flexDirection: 'row',
    },
    amountContainer: {
        flexDirection: 'row',
    },
    icon: {
        color: 'white',
    },
    text: {
        color: 'white',
    },
    titleText: {
        fontSize: 17,
        marginLeft: 20,
        fontWeight: 'bold',
    },
    amountText: {
        fontSize: 23,
        fontWeight: 'bold',
    },
    descText: {
        fontSize: 12,
    }
})

export default RoundTitle;
import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Button, Text } from 'native-base';
import colors from '../../components/colors';

const CallToAction = props => {

    const { title, pressHandler } = props;


    return (
        <Button
            onPress={ () => (pressHandler && pressHandler()) }
            style={ styles.button }
        >
            <Text uppercase={false} style={ styles.text }>{ title }</Text>
        </Button>
    )

}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.mainBlue,
        borderRadius: 5,
        paddingHorizontal: 60,
    },
    text: {
        color: 'white',
        textAlign: 'center'
    }
});

export default CallToAction;
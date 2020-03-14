import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CaptionInfo = props => {

    const { title, children } = props;


    return (
        <View style={ styles.container }>

            <View style={ styles.titleContainer }>
                <Text style={ styles.textTitle }>{ title }</Text>
            </View>

            <View style={ styles.content }>
                { children }
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        borderBottomWidth: 1,
        borderColor: '#8a8a8a',
        paddingVertical: 3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 10,
    },
    textTitle: {
        color: '#000',
        fontSize: 12
    }
});

export default CaptionInfo;
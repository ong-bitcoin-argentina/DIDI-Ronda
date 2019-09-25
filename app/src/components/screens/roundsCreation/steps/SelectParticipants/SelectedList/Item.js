import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Avatar from '../Avatar';

const Item = props => {

    const { item, index, pressHandler } = props;

    return (
        <TouchableOpacity style={ styles.itemContainer } onPress={ pressHandler }>
            <Avatar path={props.detail ? item.user.picture : item.thumbnailPath } />
            <Text>{props.detail ? item.user.name : index + 1}</Text>
           {!props.detail && <Icon style={ styles.closeIcon } name="close" type="MaterialIcons" />}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        marginRight: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    closeIcon: {
        position:'absolute',
        color: 'white',
        backgroundColor:  '#673AB7',
        fontSize: 10,
        borderRadius: 10,
        right: 0,
        top: 10,
        padding: 1
    }
});


export default Item;
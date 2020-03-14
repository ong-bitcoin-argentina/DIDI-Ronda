import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native';
import Item from './Item';

const ContactList = props => {

    const { contactList, pressHandler } = props;

    return (
        <FlatList
            data={ contactList }
            renderItem={ ({item, index}) => <Item contact={item} pressHandler={ () => pressHandler( item ) } /> }
            keyExtractor={ (data) => `contact-${data.recordID}` }
            scrollEnabled={false} />

    )
}

const styles = StyleSheet.create({
});

export default ContactList;
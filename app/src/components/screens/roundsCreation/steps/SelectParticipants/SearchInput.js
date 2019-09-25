import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native';
import { Item, Input, Icon } from 'native-base';
import colors from '../../../../components/colors';

const SearchInput = props => {

    const { filter, resetFilter } = props;

    const [val, setVal] = useState('');

    useEffect(() => {
        if (val.trim() != '') {
            filter(val);
        } else {
            resetFilter();
        }
    }, [val]);

    return (
        <Item style={styles.searchContainer}>
        <Icon active name={'search'} style={{color: colors.secondary}} />
        <Input
            placeholderTextColor={colors.secondary}
            placeholder={'Buscar por nombre o alias'}
            style={{
            color: colors.mainBlue,
            fontStyle: val.trim() != '' ? 'normal' : 'italic',
            }}
            value={val}
            onChangeText={text => {
            setVal(text);
            }}
        />
        </Item>
    );

}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row-reverse',
        width: '90%',
        justifyContent: 'center',
        color: colors.mainBlue,
        borderColor: colors.mainBlue,
        borderWidth: 3,
    },
});


export default SearchInput;
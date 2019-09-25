import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../../../../components/colors';
import { Icon } from 'native-base';
import Avatar from '../Avatar';

const Item = props => {

  const { contact, pressHandler } = props;

  return (
    <TouchableOpacity style={styles.contactContainer} onPress={ pressHandler } >

      <View style={styles.contactThumbnailContainer}>
        <View style={{marginRight: 20}}>
          <Avatar path={ contact.thumbnailPath } />
        </View>

        <View>
          <Text style={styles.contactName}>
            {contact.givenName || ''} {contact.familyName || ''}
          </Text>
          <Text style={styles.contactNumber}>
            { contact.phoneNumbers && contact.phoneNumbers.length > 0
              ? contact.phoneNumbers[0].number
              : 'No tiene numero'}
          </Text>
        </View>
      </View>

      <View style={styles.contactIconContainer}>
        <Icon name="add" style={styles.addIcon}></Icon>
      </View>

    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  contactContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 70,
    paddingHorizontal: 20,
    width: '100%'
  },
  contactThumbnailContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  contactIconContainer: {
    justifyContent: 'flex-end'
  },
  contactName: {
    color: colors.gray, 
    fontWeight: '600', 
    fontSize: 16,
  },
  contactNumber: {
    color: colors.secondary, 
    fontSize: 13
  },
  addIcon: {
    color: colors.mainBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default Item;
import React from 'react'
import { StyleSheet, Image } from 'react-native';
import emptyAvatar from '../../../../../assets/img/avatar.png';

const Avatar = props => {
    const { path } = props;
    return (
      <Image
          style={styles.contactThumbnail}
          source={ path ? {uri: path} : emptyAvatar }
      />
    )
}
const styles = StyleSheet.create({
  contactThumbnail: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default Avatar;
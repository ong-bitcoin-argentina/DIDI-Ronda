import React from 'react'
import { StyleSheet, Image } from 'react-native';
import emptyAvatar from '../../assets/img/avatar.jpg';

const Avatar = props => {
    const { path, size } = props;
    return (
      <Image
          style={[styles.contactThumbnail, size && {height: size, width: size}]}
          source={ path ? {uri: path} : emptyAvatar }
      />
    )
}
const styles = StyleSheet.create({
  contactThumbnail: {
    height: 40,
    width: 40,
    aspectRatio: 1,
    borderRadius: 5000,
  },
});

export default Avatar;
import React from "react";
import { StyleSheet, Image } from "react-native";
import emptyAvatar from "../../../../../assets/img/avatar.png";

const Avatar = props => {
  const { path, size = 40 } = props;
  return (
    <Image
      style={{ ...styles.contactThumbnail, height: size, width: size }}
      source={path ? { uri: path } : emptyAvatar}
    />
  );
};
const styles = StyleSheet.create({
  contactThumbnail: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default Avatar;

import React from "react";
import { StyleSheet, Image } from "react-native";
import emptyAvatar from "../../assets/img/avatar.jpg";
import colors from "./colors";

const Avatar = ({ path, size, selected }) => {
  return (
    <Image
      style={[
        styles.contactThumbnail,
        size && { height: size, width: size },
        selected && styles.selected,
      ]}
      source={path ? { uri: path } : emptyAvatar}
    />
  );
};
const styles = StyleSheet.create({
  contactThumbnail: {
    height: 40,
    width: 40,
    aspectRatio: 1,
    borderRadius: 5000,
  },
  selected: {
    borderColor: colors.mainBlue,
    borderWidth: 3,
  },
});

export default Avatar;

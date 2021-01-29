import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  PixelRatio,
  Dimensions,
} from "react-native";
import colors from "../../components/colors";
import { Button } from "native-base";

const FONT_SCALE = PixelRatio.getFontScale();
const SCREEN_WIDTH = Dimensions.get("window").width;

const Snippet = ({
  ImageSource,
  CustomIcon,
  primaryColor,
  description,
  buttonText,
  onAction,
  style,
}) => {
  const renderCustomIcon = () => (
    <CustomIcon style={{ marginHorizontal: 10 }} />
  );

  const renderImage = () => {
    return <Image source={ImageSource} style={{ height: 100, width: 100 }} />;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <View>{CustomIcon ? renderCustomIcon() : renderImage()}</View>
        <View style={styles.secondCol}>
          <Text style={[styles.description, { color: primaryColor }]}>
            {description}
          </Text>
          <Button
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={onAction}>
            <Text
              style={styles.buttonInner}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {buttonText}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 25,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonInner: {
    fontSize: SCREEN_WIDTH <= 320 ? null : 17 / FONT_SCALE,
    color: "white",
    textAlign: "center",
  },
  button: {
    width: "100%",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  description: {
    marginBottom: 14,
    fontSize: 16,
  },
  secondCol: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "flex-start",
  },
});

export default Snippet;

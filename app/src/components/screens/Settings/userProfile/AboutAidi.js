import React from "react";
import { ScrollView, Text, Image, View, StyleSheet } from "react-native";
import { aboutAidi } from "./constants";

const AboutAidi = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 30 }}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../../assets/img/aidi.png")}
          style={styles.image}
        />
      </View>
      {aboutAidi.map((p, index) => (
        <Text style={styles.paragraph} key={index}>
          {p.map((item, subindex) => (
            <Text style={[item.style, { fontSize: 16 }]} key={subindex}>
              {item.text}
            </Text>
          ))}
        </Text>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    paddingHorizontal: 70,
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "contain",
  },
  paragraph: {
    textAlign: "justify",
    marginVertical: 8,
  },
});

export default AboutAidi;

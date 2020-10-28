import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { aboutRonda } from "./constants";
import BigLogo from "../../../../assets/img/logo-big.svg";

const AboutRonda = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 30 }}>
      <View style={styles.imageContainer}>
        <BigLogo style={styles.image} />
      </View>
      {aboutRonda.map((p, index) => (
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
    alignItems: "center",
    paddingVertical: 30,
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

export default AboutRonda;

import React from "react";
import { SectionList, Text, StyleSheet, View } from "react-native";
import Notification from "./Notification";
import MessageBox from "../../../assets/img/message-box.svg";
import colors from "../../components/colors";

const NotificationsList = ({ data }) => {
  const renderEmpty = () => (
    <View style={styles.emptyView}>
      <Text style={styles.emptyDescription}>Aún no tenés notificaciones.</Text>
      <Text style={[styles.emptyDescription, { marginBottom: 28 }]}>
        ¡Vas a recibir tan pronto empieces a jugar tus rondas!
      </Text>
      <MessageBox />
    </View>
  );

  return !data.old.length && !data.recent.length ? (
    renderEmpty()
  ) : (
    <SectionList
      sections={[
        { title: "Esta Semana", data: data.recent },
        { title: "Anteriores", data: data.old },
      ]}
      renderSectionHeader={({ section }) => (
        <Text style={styles.title}>{section.title}</Text>
      )}
      headerTitleStyle={styles.title}
      renderSectionFooter={({ section }) =>
        !section.data.length && <Text>No se encontraron resultados.</Text>
      }
      renderItem={({ item }) => <Notification notification={item} />}
      keyExtractor={(item, index) => item + index}
      numColumns={1}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={30}
      windowSize={9}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
  },
  emptyView: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    paddingHorizontal: "14%",
    paddingBottom: "10%",
  },
  emptyDescription: {
    marginBottom: 18,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: colors.darkestGray,
  },
});

export default NotificationsList;

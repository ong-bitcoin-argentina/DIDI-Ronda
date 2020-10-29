import React, { useEffect } from "react";
import { SectionList, Text, StyleSheet, View } from "react-native";
import Notification from "./Notification";
import MessageBox from "../../../assets/img/message-box.svg";
import colors from "../../components/colors";
import { connect } from "react-redux";

const NotificationsList = ({ old, recent, list }) => {
  const renderEmpty = () => (
    <View style={styles.emptyView}>
      <Text style={styles.emptyDescription}>Aún no tenés notificaciones.</Text>
      <Text style={[styles.emptyDescription, { marginBottom: 28 }]}>
        ¡Vas a recibir tan pronto empieces a jugar tus rondas!
      </Text>
      <MessageBox />
    </View>
  );

  return !list.length ? (
    renderEmpty()
  ) : (
    <SectionList
      sections={[
        { title: "Esta Semana", data: recent },
        { title: "Anteriores", data: old },
      ]}
      renderSectionHeader={({ section }) =>
        !!section.data.length && (
          <Text style={styles.title}>{section.title}</Text>
        )
      }
      ListFooterComponent={() => <View style={{ marginBottom: 40 }}></View>}
      ListHeaderComponent={() => <View style={{ marginTop: 10 }}></View>}
      renderItem={({ item }) => <Notification notification={item} />}
      headerTitleStyle={styles.title}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      keyExtractor={(item, index) => item + index}
      numColumns={1}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={30}
      windowSize={9}
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

export default connect(
  state => ({
    old: state.notifications.old,
    recent: state.notifications.recent,
    list: state.notifications.list,
  }),
  dispatch => ({}),
)(NotificationsList);

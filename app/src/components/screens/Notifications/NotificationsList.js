import React, { useState, useEffect } from "react";
import {
  SectionList,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import Notification from "./Notification";
import MessageBox from "../../../assets/img/message-box.svg";
import colors from "../../components/colors";
import { connect } from "react-redux";
import { Icon } from "native-base";

const NotificationsList = ({ old, recent, list, onMarkAsViewd }) => {
  const [isAllViewed, setIsAllViewed] = useState(false);

  const checkAllViewed = () => {
    for (let i = 0; i < list.length; i++) {
      const notification = list[i];

      if (!notification.hasOwnProperty("viewedAt")) {
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    const allViewed = checkAllViewed();
    setIsAllViewed(allViewed);
  }, [list]);

  const renderEmpty = () => (
    <View style={styles.emptyView}>
      <Text style={styles.emptyDescription}>Aún no tenés notificaciones.</Text>
      <Text style={[styles.emptyDescription, { marginBottom: 28 }]}>
        ¡Vas a recibir tan pronto empieces a jugar tus rondas!
      </Text>
      <MessageBox />
    </View>
  );

  const renderSectionTitle = section => {
    if (section.data.length > 0 && section.title === "Esta Semana") {
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{section.title}</Text>
          {!isAllViewed ? (
            <TouchableOpacity
              style={styles.markAsReadContainer}
              onPress={() => onMarkAsViewd()}>
              <Icon
                type="MaterialIcons"
                name="check-circle"
                style={styles.markAsReadIcon}
              />
              <Text style={styles.markAsReadText}>Marcar como leídas</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }

    return <Text style={styles.title}>{section.title}</Text>;
  };

  return !list.length ? (
    renderEmpty()
  ) : (
    <SectionList
      sections={[
        { title: "Esta Semana", data: recent },
        { title: "Anteriores", data: old },
      ]}
      renderSectionHeader={({ section }) =>
        !!section.data.length && renderSectionTitle(section)
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
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  markAsReadContainer: {
    marginTop: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  markAsReadIcon: {
    color: colors.mainBlue,
    fontSize: 15,
  },
  markAsReadText: {
    marginLeft: 5,
    color: colors.mainBlue,
    fontSize: 12,
    lineHeight: 14,
  },
});

export default connect(
  state => ({
    old: state.notifications.old,
    recent: state.notifications.recent,
    list: state.notifications.list,
  }),
  dispatch => ({})
)(NotificationsList);

import React from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Redux
import { useSelector } from 'react-redux';
import { selectUserInfo } from "../../../Redux/userSlice";
import FollowRequest from "./FollowRequest";

const Notifications = ({ navigation }) => {

  const user = useSelector(selectUserInfo);
  // console.log(user.requests.incoming)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity testID="back-button" onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon="fa-caret-left" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Follow Requests ({user.requests.incoming.length})</Text>
      </View>
      <ScrollView style={{ marginTop: 20 }}>
        {user.requests.incoming.map((request, index) => (
          <FollowRequest key={index} requesterId={request} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 2
  },
});

export default Notifications;
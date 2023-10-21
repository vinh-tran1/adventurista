import React from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const FeedFixedTop = () => {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../../assets/logo.png')}/>
        <FontAwesomeIcon style={{ marginTop: 20 }} icon="fa-bell" size={25} />
      </View>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.location}>
          <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-pin" size={20} />
          <Text style={{ marginTop: 2, fontSize: 13 }}>New Haven, CT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 7.5 }}>
          <FontAwesomeIcon color={"#D99BFF"} icon="magnifying-glass" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 0.25,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  topBar: {
    paddingHorizontal: 20,
    marginVertical: 12.5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  logo: {
    height: 60,
    width: 200,
  },
  location: {
    flexDirection: "row",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5
  }
});

export default FeedFixedTop;
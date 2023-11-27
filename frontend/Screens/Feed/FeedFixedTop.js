import React from "react";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../Redux/userSlice";

const FeedFixedTop = ({ navigation }) => {

  const user = useSelector(selectUserInfo);

  const handleSetLocation = async () => {
    // api call to update location, keep everything else the same
    // maybe use effect with dependency essentially?
    console.log("set location");
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../../assets/logo.png')}/>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <FontAwesomeIcon style={{ marginTop: 20 }} icon="fa-bell" size={25} />
        </TouchableOpacity>
      </View>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.location} onPress={handleSetLocation}>
          <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={20} />
          <Text style={{ marginTop: 2, fontSize: 13 }}>{user.primaryLocation}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={{ marginTop: 7.5 }}>
          <FontAwesomeIcon color={"#D99BFF"} icon="magnifying-glass" size={20} />
        </TouchableOpacity> */}
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
    // justifyContent: "space-between"
    justifyContent: "flex-start"
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
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, ScrollView, View, Image, TouchableOpacity, TextInput} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Post = () => {
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [day, setDay] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {/* header */}
      <View style={styles.header}>
          <Text style={styles.headerText}>New Event</Text>
        </View>

        {/* nav buttons on top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity >
            <Text style={styles.navButton}>Exit</Text>
          </TouchableOpacity>

          <Text style={{fontSize:20, fontWeight: "600"}}>Event Details</Text>

          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButton}>Post</Text>
          </TouchableOpacity>
        </View>

        {/* image */}
        <View style={styles.centerContainer}>
          <View style={styles.image}>

          </View>
        </View>

        {/* text inputs */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>What?</Text>
          <TextInput value={eventName} placeholder="Event Name" onChangeText={(text) => setEventName(text)} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Where?</Text>
          <TextInput value={location} placeholder="Location" onChangeText={(text) => setLocation(text)} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>When</Text>
          <TextInput value={day} placeholder="Day" onChangeText={(text) => setDay(text)} style={styles.smallInput} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Caption</Text>
          <TextInput 
            value={caption} 
            placeholder="Describe the event!" 
            multiline={true}
            numberOfLines={5}
            onChangeText={(text) => setCaption(text)} 
            style={styles.largeInput} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags (max 4)</Text>
          
        </View>
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
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 0.25,
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between'
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold" 
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30
  },
  navButton: {
    fontSize: 16, 
    fontWeight: '500', 
    color:'#D186FF',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: 'gray',
    height: 110,
    width: 110
  },
  inputContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 5
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold"
  },
  input: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: 0.25,
    borderColor: "#D186FF",
    backgroundColor: "rgba(243, 232, 255, 0.45)",
    marginBottom: 5,
    borderRadius: 5,
    color: 'gray'
  },
  smallInput: {
    width: 80,
    alignContent: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: 0.25,
    borderColor: "#D186FF",
    backgroundColor: "rgba(243, 232, 255, 0.45)",
    marginBottom: 5,
    borderRadius: 5,
    color: 'gray'
  },
  largeInput: {
    height: 120,
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: 0.25,
    borderColor: "#D186FF",
    backgroundColor: "rgba(243, 232, 255, 0.45)",
    marginBottom: 5,
    borderRadius: 5,
    color: 'gray'
  },
});

export default Post;
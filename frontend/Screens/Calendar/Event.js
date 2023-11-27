import React, { useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const Event = (props) => {

  const { attending } = props;

  return (
    <ImageBackground source={{uri: "https://s.hdnux.com/photos/64/42/33/13772497/4/1200x0.jpg"}} style={styles.container}>
        <View style={styles.postHeader}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{fontSize: 18, fontWeight: "bold", marginTop: 2.5}}>Hallowoads</Text>
                <TouchableOpacity>
                    <FontAwesomeIcon style={{ marginTop: 5, marginRight: 5 }} icon="trash" size={17.5} />
                </TouchableOpacity>
            </View>
            <View style={styles.locationContainer}>
                <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={15} />
                <Text style={{ fontWeight: "bold", fontSize: 12 }}>300 York St. New Haven</Text>
            </View>
        </View>
        <View style={styles.bottomContent}>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 25, height: 25 }}>
                            <FontAwesomeIcon style={{ marginLeft: 6, marginTop: 5 }} icon="user" size={13} />
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: "bold", color: "white", marginLeft: 5, marginTop: 7.5 }}>+24 others</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: "white", fontWeight: "bold" }}>by Vinh</Text>
                </View>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Wed, Oct 25</Text>
                    <Text style={{ color: "white", textAlign: "center", fontSize: 13 }}>10:30 PM</Text>
                </View>
            </View>
        </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 125,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  postHeader: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    paddingVertical: 2.5,
    paddingHorizontal: 10,
  },
  locationContainer: {
    flexDirection: "row",
    backgroundColor: 'rgba(255, 255, 255, 0.80)',
    marginVertical: 5,
    padding: 5,
    borderRadius: 5,
    width: "60%"
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
    marginHorizontal: 15,
  }
});

export default Event;
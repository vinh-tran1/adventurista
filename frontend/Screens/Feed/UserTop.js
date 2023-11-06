import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from "../../Shared/BubbleText";

const UserTop = (props) => {

    const { profile_pic, interests } = props;

    return (
        <ImageBackground source={{uri: profile_pic}} style={styles.postTop}>
            <View style={styles.bottomContent}>
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <TouchableOpacity style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 30, height: 30 }}>
                            <FontAwesomeIcon style={{ marginLeft: 7.5, marginTop: 7.5 }} icon="user" size={15} />
                        </TouchableOpacity>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 12, marginTop: 5 }}>10 mutual friends</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                    {interests.map((interest, index) => {
                        return (
                            <BubbleText key={index.toString()} title={interest} />
                        )
                    })}
                </View>
            </View>
        </ImageBackground>
    )
  };

  const styles = StyleSheet.create({
    postTop: {
        height: 456, 
    },
    locationContainer: {
        flexDirection: "row",
        backgroundColor: 'rgba(255, 255, 255, 0.80)',
        marginVertical: 5,
        padding: 5,
        borderRadius: 5,
        width: "55%"
    },
    bottomContent: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 20,
        marginHorizontal: 15,
    }
  });
  
  export default UserTop;
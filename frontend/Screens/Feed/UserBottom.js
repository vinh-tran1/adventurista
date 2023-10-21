import React from "react";
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from "../../Shared/BubbleText";

const UserBottom = (props) => {

    const { name, age, from } = props;

    return (
        <View style={styles.postBottom}>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View style={styles.topContainer}>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>{name} </Text>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#D99BFF", marginTop: 3 }}>{age}</Text>
                </View>
                <View style={{ flexDirection: "row", marginTop: 12.5 }}>
                    <TouchableOpacity style={{ marginRight: 12.5 }}>
                        <FontAwesomeIcon color={"#717171"} icon="user-plus" size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginTop: 3 }}>
                        <FontAwesomeIcon  color={"#717171"} icon="message" size={21} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: "#717171" }}>120 friends, 5 groups</Text>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: "#717171", marginTop: 2 }}>from {from}</Text>
            </View>
        </View>
    )
  };

  const styles = StyleSheet.create({
    postBottom: {
        height: 112, 
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    topContainer: {
        marginVertical: 7.5,
        flexDirection: "row",
    }
  });
  
  export default UserBottom;
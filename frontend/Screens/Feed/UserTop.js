import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from "../../Shared/BubbleText";

const UserTop = (props) => {

    const { createdByObj, profile_pic, interests, navigation } = props;
    // console.log(JSON.stringify(createdByObj))

    // need logic for if they are friends or not -> use REDUX
    const handleViewProfile = () => {
        navigation.navigate('FriendProfileView', {poster: createdByObj});
    };

    return (
        <ImageBackground source={{uri: profile_pic}} style={styles.postTop}>
            <View style={styles.bottomContent}>
                <View style={{ flexDirection: "row", backgroundColor: '#4b3654', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, width: '40%' }}>
                    <TouchableOpacity 
                        style={{ backgroundColor: "#D186FF", borderRadius: 20, borderWidth: 0.5, borderColor: 'white', width: 30, height: 30, marginRight: 4}}
                        onPress={handleViewProfile}
                    >
                        <FontAwesomeIcon style={{ marginLeft: 7.5, marginTop: 7.5 }} icon="user" size={15}/>
                    </TouchableOpacity>
                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 12, marginTop: 5, marginLeft: 2 }}>10 mutual friends</Text>
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
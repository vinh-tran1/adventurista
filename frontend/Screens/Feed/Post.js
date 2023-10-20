import React from "react";
import { View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import PostTop from "./PostTop";
import BubbleText from "../../Shared/BubbleText";

const Post = (props) => {

    const { title, location, caption, img, createdBy, date, time } = props;

    return (
        <View style={styles.postContainer}>
            <PostTop 
                title={title} 
                location={location} 
                img={img} 
                createdBy={createdBy} 
                date={date} 
                time={time} 
            />
            <View style={styles.postBottom}>
                <View style={styles.tagContainer}>
                    <BubbleText title={"club"} />
                    <BubbleText title={"yale"} />
                    <BubbleText title={"holiday"} />
                </View>
                <Text>{caption}</Text>
            </View>
        </View>
    )
  };

  const styles = StyleSheet.create({
    postContainer: {
        paddingVertical: 5,
    },
    postBottom: {
        height: 112, 
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    tagContainer: {
        marginVertical: 10,
        flexDirection: "row"
    }
  });
  
  export default Post;
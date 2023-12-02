import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from "../../Shared/BubbleText";
import axios from 'axios';

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../../Redux/userSlice";

const PostBottom = (props) => {

    const { caption, tags, eventId } = props;

    const user = useSelector(selectUserInfo);
    const dispatch = useDispatch();

    const ATTEND_API_URL = process.env.REACT_APP_AWS_API_URL + 'events/going-to-event';
    const SAVE_API_URL = process.env.REACT_APP_AWS_API_URL + 'users/events/save/' + user.userId + "/" + eventId;

    const [isAttending, setIsAttending] = useState(user.eventsGoingTo.includes(eventId));
    const [isSaved, setIsSaved] = useState(user.eventsSaved.includes(eventId));

    const handleAttendEvent = async () => {
      try {
          const response = await axios.post(ATTEND_API_URL, {
          userId: user.userId,
          eventId: eventId
        });
        if (response.status === 200) {
          const updatedUser = response.data;
          setIsAttending(true);
          console.log(updatedUser)

          dispatch(setUserInfo({
            newPost: false,
            ...updatedUser
          }));

          console.log("Successfully added event to your calendar");
        } else {
          console.log("Error adding this event to your calendar");
        }
      } catch (err) {
        console.log(err);
        console.log("An error occurred while adding this event to your calendar. Please try again.");
      }
    }

    const handleSaveEvent = async () => {
        try {
          const response = await axios.post(SAVE_API_URL);
          if (response.status === 200) {

            const updatedUser = response.data;
            setIsSaved(true);
            // console.log("events saved", updatedUser.eventsSaved);

            dispatch(setUserInfo({
              newPost: false,
              ...updatedUser
            }));

            console.log("Successfully saved event to your saved events list");
          } else {
            console.log("Error saving this event to your saved events list");
          }
        } catch (err) {
          console.log(err);
          console.log("An error occurred while saving this event to your saved events list. Please try again.");
        }
    }

    return (
        <View style={styles.postBottom}>
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <View style={styles.tagContainer}>
                    {tags.map((tag, index) => {
                        return (
                            <BubbleText key={index.toString()} title={tag} />
                        )
                    })}
                </View>
                <View style={{ flexDirection: "row", marginTop: 12.5 }}>
                    {!isAttending ? 
                      <TouchableOpacity testID="attend-button" style={{ marginRight: 12.5 }} onPress={handleAttendEvent}>
                        <FontAwesomeIcon  color={"#717171"} icon="calendar-plus" size={25} />
                      </TouchableOpacity>
                      :
                      <View style={{ marginRight: 12.5 }}>
                        <FontAwesomeIcon color={"#D186FF"} icon="calendar-plus" size={25} />
                      </View>
                    }
                    {!isSaved ? 
                      <TouchableOpacity testID="save-button" style={{ marginTop: 1.5 }} onPress={handleSaveEvent}>
                          <FontAwesomeIcon  color={"#717171"} icon="bookmark" size={24} />
                      </TouchableOpacity>
                      :
                      <View style={{ marginTop: 1.5 }}>
                        <FontAwesomeIcon  color={"#D186FF"} icon="bookmark" size={24} />  
                      </View>
                    }

                </View>
            </View>
            <View style={styles.captionContainer}>
                <Text style={{ fontWeight: "bold", fontSize: 12, color: "#717171" }}>{caption}</Text>
            </View>
        </View>
    )
  };

  const styles = StyleSheet.create({
    postBottom: {
        height: 112, 
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 12.5
    },
    tagContainer: {
        marginVertical: 10,
        flexDirection: "row",
    },
    captionContainer: {
        marginTop: 7.5,
        marginLeft: 2.5
    }
  });
  
  export default PostBottom;
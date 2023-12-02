import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import PostTop from "./PostTop";
import PostBottom from "./PostBottom";
import UserTop from "./UserTop";
import UserBottom from "./UserBottom";
import axios from 'axios';
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectNewPost, setNewPost, selectUserInfo } from '../../Redux/userSlice';

const Post = (props) => {

    const { eventId, title, location, caption, img, createdBy, date, time, tags, navigation } = props;

    const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/';
    const API_URL_EVENTS = process.env.REACT_APP_AWS_API_URL + 'events/event/' + eventId;
    const user = useSelector(selectUserInfo);
    const newPost = useSelector(selectNewPost);
    const dispatch = useDispatch();  
    const [poster, setPoster] = useState("");
    const [activeSlide, setActiveSlide] = useState(0);
    const [peopleAttending, setPeopleAttending] = useState([]);
    const [totalAttending, setTotalAttending] = useState(0);

    const handleLeftTap = () => {
        if (activeSlide > 0) {
          setActiveSlide(activeSlide - 1); // Move to the previous slide
        }
      };
    
      const handleRightTap = () => {
        if (activeSlide < peopleAttending.length - 1) {
          setActiveSlide(activeSlide + 1); // Move to the next slide
        }
      };

    useEffect(() => {
        // get's information on poster of event
        axios.get(API_URL + createdBy) 
        .then((response) => {
            dispatch(setNewPost(false));
            setPoster(response.data);
        })
        .catch((error) => {
            console.log("fail to get poster")
            console.log(error);
        });
        // gets event information
        axios.get(API_URL_EVENTS) 
        .then((response) => {
            dispatch(setNewPost(false));
            const temp = response.data.whoIsGoing.filter(personId => personId !== user.userId);

            setTotalAttending(temp.length);

            if (response.data.whoIsGoing.length > 4) 
                temp = temp.slice(0, 4);

            setPeopleAttending([null, ...temp]);

        })
        .catch((error) => {
            console.log("fail to get event info from post")
        });
    }, [newPost, user?.friends || [], user?.eventsGoingTo || [], user?.eventsSaved || []]);

    return (
        <View>
            <Swiper
                loop={false}
                index={activeSlide}
                onTouchEnd={() => setActiveSlide(activeSlide)}
                height={"100%"}
            >
                {peopleAttending.map((userId, index) => (
                <View key={index}>
                    {userId === null ? (
                    <View style={styles.postContainer}>
                        <PostTop 
                            title={title} 
                            location={location} 
                            img={img} 
                            createdBy={poster.firstName} 
                            createdByObj={poster}
                            date={date} 
                            time={time} 
                            attendance={totalAttending}
                            navigation={navigation}
                        />
                        <PostBottom eventId={eventId} caption={caption} tags={tags} />
                    </View>
                    ) : (
                    <View style={styles.postContainer}>
                        <UserTop 
                            createdByObj={poster}
                            userId={userId}
                            update={activeSlide}
                            // profile_pic={user.profile_pic} 
                            // interests={user.interests}
                            navigation={navigation}
                        />
                        <UserBottom
                            // name={user.name}
                            // age={user.age}
                            // from={user.from}
                            userId={userId}
                            update={activeSlide}
                            navigation={navigation}
                        />
                    </View>
                    )}
                </View>
                ))}
            </Swiper>
            <TouchableOpacity testID="left-touchable" onPress={handleLeftTap} style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '55%'}}>
                {/* Left 1/3 of the screen is a touchable area for moving to the previous slide */}
            </TouchableOpacity>
            <TouchableOpacity testID="right-touchable" onPress={handleRightTap} style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '75%'}}>
                {/* Right 1/3 of the screen is a touchable area for moving to the next slide */}
            </TouchableOpacity>

        </View>
    )
  };

  const styles = StyleSheet.create({
    postContainer: {
        paddingVertical: 5,
    }
  });
  
  export default Post;
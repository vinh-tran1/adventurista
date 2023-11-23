import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import PostTop from "./PostTop";
import PostBottom from "./PostBottom";
import UserTop from "./UserTop";
import UserBottom from "./UserBottom";
import axios from 'axios';

const Post = (props) => {
    const [userName, setUserName] = useState("")
    const { title, location, caption, img, createdBy, date, time, tags } = props;

    // const url = 'https://weaapwe0j9.execute-api.us-east-1.amazonaws.com/users/'
    const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/';

    const [activeSlide, setActiveSlide] = useState(0);

    const nikhil = {
        name: "NIKHIL",
        age: "20",
        profile_pic: "https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_400_400/0/1643655075770?e=1704326400&v=beta&t=1K3-4rPZswziH2cbOMNbOB0-6Oq6g2xeCkFs1zPpX_A",
        interests: ["squash", "catan", "south bay"],
        from: "toronto, canada"
    }
    const vinh = {
        name: "VINH",
        age: "20",
        profile_pic: "https://media.licdn.com/dms/image/C4E03AQG_u4KCopf_dA/profile-displayphoto-shrink_800_800/0/1642457325916?e=1703116800&v=beta&t=TSsp3EjRAUXjiKmqRWj7yKQK2LzRukoG8ssxlNAuHdo",
        interests: ["paddle", "consulting", "pauli murray"],
        from: "boston, massachusetts"
    }
    const patrick = {
        name: "PATRICK",
        age: "21",
        profile_pic: "https://media.licdn.com/dms/image/C4D03AQEEcYoIdoYJGg/profile-displayphoto-shrink_800_800/0/1573619508976?e=1703116800&v=beta&t=sKbslX-_dW8kggNkCcJDdq_c_pgd4XJS3pxxHTO-0GA",
        interests: ["morse", "chelsea", "fifa"],
        from: "salisbury, maryland"
    }
    const attending = [null, nikhil, vinh, patrick]; // Add your image sources

    const handleLeftTap = () => {
        if (activeSlide > 0) {
          setActiveSlide(activeSlide - 1); // Move to the previous slide
        }
      };
    
      const handleRightTap = () => {
        if (activeSlide < attending.length - 1) {
          setActiveSlide(activeSlide + 1); // Move to the next slide
        }
      };

    useEffect(() => {
        // console.log(user.userId)
        axios.get(API_URL + createdBy) 
        .then((response) => {
            setUserName(response.data.firstName);
        })
        .catch((error) => {
            console.log(error);
    });

    }, []);

    return (
        <View>
            <Swiper
                loop={false}
                index={activeSlide}
                onTouchEnd={() => setActiveSlide(activeSlide)}
                height={"100%"}
            >
                {attending.map((user, index) => (
                <View key={index}>
                    {user === null ? (
                    <View style={styles.postContainer}>
                        <PostTop 
                            title={title} 
                            location={location} 
                            img={img} 
                            createdBy={userName} 
                            date={date} 
                            time={time} 
                        />
                        <PostBottom caption={caption} tags={tags} />
                    </View>
                    ) : (
                    <View style={styles.postContainer}>
                        <UserTop 
                            profile_pic={user.profile_pic} 
                            interests={user.interests}
                        />
                        <UserBottom
                            name={user.name}
                            age={user.age}
                            from={user.from}
                        />
                    </View>
                    )}
                </View>
                ))}
            </Swiper>
            <TouchableOpacity onPress={handleLeftTap} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%' }}>
                {/* Left half of the screen is a touchable area for moving to the previous slide */}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRightTap} style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%' }}>
                {/* Right half of the screen is a touchable area for moving to the next slide */}
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
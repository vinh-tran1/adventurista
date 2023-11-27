import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import BubbleText from "../../Shared/BubbleText";
import Bubble from "./Bubble";
import MyGroups from "./MyGroups";
import MyEvents from "./MyEvents";
import getAge from "../../Shared/GetAge";
import axios from "axios";
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../../Redux/userSlice";

const FriendProfileView = ({ navigation, route }) => {
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/friend-request';
  const { poster } = route.params;
  // console.log(poster);

  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const age = getAge(poster.age);

  const [isFriend, setIsFriend] = useState(user.friends.some(friendId => friendId === poster.userId));
  const [requested, setRequested] = useState(user.requests.outgoing.some(friendId => friendId === poster.userId));
  const [friendStatus, setFriendStatus] = useState(isFriend ? "Friends" : requested ? "Requested" : "Add Friend");
  //console.log(user.requests)
  const profilePic = 'https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_800_800/0/1643655076107?e=2147483647&v=beta&t=v3YTetBWO8TOjEv-7hxNvsOdQWswiQT1DoGAJ7PNlDY'
  const profileBannerImg = 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG';
  const groupData = [
    {
      img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG',
      name: 'squash1'
    },
    {
      img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG',
      name: 'squash2'
    },
    {
      img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG',
      name: 'squash3'
    },
    {
      img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG',
      name: 'squash4'
    },
    {
      img: 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG',
      name: 'squash5'
    }
  ];
  console.log(requested)
  // also need modal for the elipises to block or remove friend
  // show full profile if friends, button click only to request friends, then should be able to click when friends unless unadd
  const handleAddFriend = async () => {
    try {
      const response = await axios.post(API_URL, {
        requesterId: user.userId, 
        requestId: poster.userId
      });

      if (response.status == 200) {
        const updatedUser = response.data;
        // console.log(updatedUser);
        setRequested(true);
        setFriendStatus("Requested")
        
        // redux to update friend status 
        dispatch(setUserInfo({
          newPost: false,
          ...updatedUser
        }));

      } else {
        console.log("Error in sending friend request!");
      }

    } catch (err) {
      console.log(err);
      console.log("An error occured for sending request. Please try again");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView showsVerticalScrollIndicator={false}>
    {/* header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <FontAwesomeIcon icon="fa-caret-left" size={30} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginLeft: 8}}>
                <Text style={styles.headerText}>{poster.firstName}</Text>
                <TouchableOpacity style={{marginTop: 6}}>
                    <FontAwesomeIcon icon="fa-ellipsis" size={25} />
                </TouchableOpacity>
            </View>
        </View>

      {/* profile banner */}
      <View>
      {/* top half */}
          <ImageBackground source={{uri: profileBannerImg}} style={styles.imageBanner}>
          <View style={{position: 'absolute', top: 35}}>
              <View style={{left: 30}}>
                <Image source={{uri: profilePic}} style={styles.profilePic}/>
              </View>
              <View style={styles.bubbleRow}>
                <Bubble value={poster.eventsOwned.length} name={'Events'}/>
                <Bubble value={poster.friends.length} name={'Connections'}/>
                <Bubble value={poster.groups.length} name={'Groups'}/>
              </View>
          </View>
          </ImageBackground>

          {/* bottom half */}
          <View style={styles.bioBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 24, fontWeight: '700'}}>{poster.firstName} {poster.lastName}</Text>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: "#D99BFF", marginLeft: 6}}>{age}</Text>
                </View>

                { isFriend || requested ? 
                    <View style={{ backgroundColor: isFriend ? '#EDD3FF' : '#B3B3B3', marginLeft: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 5, borderWidth: 0.25, borderColor: 'gray'}}>
                      <Text style={{ fontSize: 12}}>{friendStatus}</Text>
                    </View>
                    :
                    <TouchableOpacity 
                      style={{ backgroundColor: '#EFEFEF', 
                            marginLeft: 6, paddingVertical: 4, paddingHorizontal: 6, borderRadius: 5, borderWidth: 0.25, borderColor: 'gray'}}
                      onPress={handleAddFriend}
                    >
                      <Text style={{ fontSize: 12}}>{friendStatus}</Text>
                    </TouchableOpacity>
                }
                  
              </View>
          
              <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                      <FontAwesomeIcon icon="location-dot" color="#D186FF"/>  
                      <Text style={{marginLeft: 5, fontSize: 16, fontWeight: '500', color: 'gray'}}>{poster.primaryLocation}</Text>
              </View>

              <Text style={{marginTop: 8, fontSize: 16}}>{user.bio}</Text>

              <View style={styles.tagContainer}>
                  {poster.interests.map((tag, index) => {
                      return (
                          <BubbleText key={index.toString()} title={tag} />
                      )
                  })}
              </View>
              
          </View>
      </View>
      
      {/* public or private view depending on friend status */}
      {!isFriend ? 
          <View style={styles.sectionContainer}>
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingVertical: 50 }}>
                  <View 
                      style={{ height: 100, width: 100, borderRadius: 50, borderWidth: 0.5, borderColor: '#D186FF', backgroundColor: "#EDDBFF", justifyContent: 'center', alignItems: 'center', marginBottom: 8}}>
                          <FontAwesomeIcon color={"black"} icon="lock" size={30} />
                  </View>
                  <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 8 }}>Not Friends Yet!</Text>
                  <Text style={{ color: '#808080' }}>Add Nikhil As A Friend To View Profile</Text> 
              </View>
          </View> :
          <View>
              <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                      <Text style={styles.sectionText}>My Groups</Text>
                  </View>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      {groupData.map((item, index) => (
                          <MyGroups key={index.toString()} img={item.img} name={item.name} />
                      ))}
                  </ScrollView>
              </View>
              <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                  <Text style={styles.sectionText}>My Events</Text>
                  </View>
              </View>

              <View style={{paddingHorizontal: 20}}>
                  <MyEvents events={poster.eventsOwned}/>
              </View>
          </View>
      } 
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
    marginTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold"
  },
  imageBanner: {
    height: 108
  },
  bioBanner: {
    height: 130,
    borderBottomWidth: 0.25,
    top: 90,
    paddingHorizontal: 20,
    marginBottom: 90
  },
  profilePic: {
    height: 150,
    width: 150,
    borderRadius: 150/2, 
    position: "absolute",
    //top: 35,
    // left: 31,
    borderWidth: 2,
    borderColor: "#EDDBFF"
  },
  bubble: {
    height: 50,
    width: 50,
    borderRadius: 50/2, 
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // position: "absolute",
    top: 78,
    left: 6
  },
  bubbleRow: {
    position: "absolute",
    top: 40,
    left: 200,
    flexDirection: 'row',
  },
  bubbleText: {
    fontSize: 18,
    fontWeight: '700'
  },
  sectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    justifyContent: 'space-between'
  },
  sectionText: {
    fontSize: 20,
    fontWeight: "700",
    color: '#D186FF',
    marginBottom: 10
  },
  tagContainer: {
    marginVertical: 10,
    flexDirection: "row",
  },
});

export default FriendProfileView;

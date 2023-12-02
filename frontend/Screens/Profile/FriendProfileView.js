import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Modal from "react-native-modal";
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
  const API_URL_ADD = process.env.REACT_APP_AWS_API_URL + 'users/friend-request';
  const API_URL_UNADD = process.env.REACT_APP_AWS_API_URL + 'users/friend-request/unadd';
  const { poster } = route.params;
  // console.log(poster);

  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const age = getAge(poster.age);
  const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 });
  // necessary for modals
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const friends = user?.friends || [];
  const requestsOutgoing = user?.requests?.outgoing || [];
  const posterEventsGoing = poster?.eventsGoingTo || [];
  const posterEventsOwned = poster?.eventsOwned || [];
  const [posterInterests, setPosterInterests] = useState(poster?.interests || []);

  const [isFriend, setIsFriend] = useState(friends.some(friendId => friendId === poster.userId));
  const [requested, setRequested] = useState(requestsOutgoing.some(friendId => friendId === poster.userId));
  const [friendStatus, setFriendStatus] = useState(isFriend ? "Friends" : requested ? "Requested" : "Add Friend");
  // the friend's groups (not the user's)
  const [groups, setGroups] = useState(posterEventsGoing.filter(event => !posterEventsOwned.includes(event)));

  // dummy data
  const profilePic = 'https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_800_800/0/1643655076107?e=2147483647&v=beta&t=v3YTetBWO8TOjEv-7hxNvsOdQWswiQT1DoGAJ7PNlDY';
  const profileBannerImg = 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG';

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setViewDimensions({ width, height });
  }, []);
  
  const handleAddFriend = async () => {
    try {
      const response = await axios.post(API_URL_ADD, {
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

        console.log("Sucessfully requested friend!")

      } else {
        console.log("Error in sending friend request!");
      }

    } catch (err) {
      console.log(err);
      console.log("An error occured for sending request. Please try again");
    }
  };

  const handelRemoveFriend = async() => {
    try {
      const response = await axios.post(API_URL_UNADD, {
        requesterId: user.userId, 
        requestId: poster.userId
      });

      if (response.status == 200) {
        const updatedUser = response.data;
        // console.log(updatedUser);
        setRequested(false);
        setIsFriend(false);
        setFriendStatus("Add Friend")
        
        // redux to update friend status 
        dispatch(setUserInfo({
          newPost: false,
          ...updatedUser
        }));

        toggleModal();
        navigation.navigate("Feed Main");
        console.log("Sucessfully removed friend!")

      } else {
        console.log("Error in unadding friend");
      }

    } catch (err) {
      console.log(err);
      console.log("An error occured for unadding friend. Please try again");
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

                <TouchableOpacity testID="ellipsis" style={{marginTop: 6}} onPress={toggleModal}>
                  <FontAwesomeIcon icon="fa-ellipsis" size={25} />
                </TouchableOpacity>
                
                <Modal 
                  testID="modal"
                  isVisible={isModalVisible}
                  backdropOpacity={0.9}
                  backdropColor="#B4B3DB"
                  animationIn="slideInLeft"
                  animationOut="slideOutRight"
                >
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', paddingHorizontal: 60, paddingVertical: 40, borderWidth: 2, borderColor: '#D99BFF', borderRadius: 10}}>
                      
                      { isFriend ? 
                        <TouchableOpacity style={{ justifyContent: 'center', marginBottom: 16 }} onPress={handelRemoveFriend}>
                          <Text style={{textAlign: 'center', color: '#D99BFF', fontSize: 20, fontWeight: 700 }}>Remove {poster.firstName} as friend?</Text>
                        </TouchableOpacity> 
                        :
                        <View style={{ justifyContent: 'center', marginBottom: 16 }}>
                          <Text style={{textAlign: 'center', color: '#D99BFF', fontSize: 20, fontWeight: 700 }}>{poster.firstName} is not a friend</Text>
                        </View>
                      }

                      <TouchableOpacity style={{ backgroundColor: '#D99BFF', padding: 5 , borderRadius: 5}} onPress={toggleModal}>
                        <Text style={{textAlign: 'center', fontSize: 16, fontWeight: 500 }}>Cancel</Text>
                      </TouchableOpacity> 
                    </View>
                  </View>
                </Modal>
                
            </View>
        </View>

      {/* profile banner */}
      <View>
      {/* top half */}
          <ImageBackground source={{uri: profileBannerImg}} style={styles.imageBanner}>
          <View style={{position: 'absolute', top: viewDimensions.height * .03}}>
              <View style={{ left: viewDimensions.width * 0.045 }}>
                <Image source={{uri: profilePic}} style={styles.profilePic}/>
              </View>
              <View style={[styles.bubbleRow, {left: viewDimensions.width * 0.45, top: viewDimensions.height * 0.065 }]}>
                <Bubble value={poster?.eventsOwned?.length || 0} name={'Events'}/>
                <Bubble value={poster?.friends?.length || 0} name={'Connections'}/>
                <Bubble value={groups.length} name={'Groups'}/>
                {/* <Bubble value={poster.groups.length} name={'Groups'}/> */}
              </View>
          </View>
          </ImageBackground>

          {/* bottom half */}
          <View style={[styles.bioBanner, {top: viewDimensions.height * 0.09}]}>
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

              <Text style={{marginTop: 8, fontSize: 16}}>{poster.bio}</Text>

              <View style={styles.tagContainer}>
                  {posterInterests.map((tag, index) => {
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
                  <Text style={{ color: '#808080' }}>Add {poster.firstName} As A Friend To View Profile</Text> 
              </View>
          </View> :
          <View>
              <View style={styles.sectionContainer}>
                  <View style={styles.sectionHeader}>
                      {groups.length > 0 ? <Text style={styles.sectionText}>My Groups</Text> : <Text style={styles.sectionText}>No Groups Joined Yet!</Text>}
                  </View>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      {/* {groupData.map((groupId) => (
                          <MyGroups key={index.toString()} groupId={groupId} />
                      ))} */}
                      {groups.map((groupId, index) => (
                          <MyGroups key={index.toString()} groupId={groupId} poster={poster}/>
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
    justifyContent: 'center',
    justifyContent: 'space-between'
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
    // top: 90,
    paddingHorizontal: 20,
    marginBottom: 80
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
    height: 45,
    width: 45,
    borderRadius: 45/2, 
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // position: "absolute",
    top: 100,
    // left: 6
  },
  bubbleRow: {
    position: "absolute",
    // top: 40,
    // left: 200,
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

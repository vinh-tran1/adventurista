import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import MyGroups from "./MyGroups";
import BubbleText from "../../Shared/BubbleText";
import Bubble from "./Bubble";
import MyEvents from "./MyEvents";
import getAge from "../../Shared/GetAge";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, clearUser } from '../../Redux/userSlice';

const ProfileUser = ({ navigation }) => {

  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  const age = getAge(user.age);
  const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 });
  const [groups, setGroups] = useState(user.eventsGoingTo.filter(event => !user.eventsOwned.includes(event)));

  const profilePic = 'https://media.licdn.com/dms/image/C4D03AQGMfYOlb4UFaw/profile-displayphoto-shrink_800_800/0/1643655076107?e=2147483647&v=beta&t=v3YTetBWO8TOjEv-7hxNvsOdQWswiQT1DoGAJ7PNlDY'
  const profileBannerImg = 'https://dxbhsrqyrr690.cloudfront.net/sidearm.nextgen.sites/yalebulldogs.com/images/2022/1/28/SAM_5155.JPG';

  const handleEditProfile = () => {
    navigation.navigate("Edit Profile");
  }

  const handleLogout = () => {
    dispatch(clearUser());
    console.log("Log out successful!");
  }

  useEffect(() => {
    const { width, height } = Dimensions.get('window');
    setViewDimensions({ width, height });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>{user.firstName}</Text>
          <TouchableOpacity style={{marginTop: 6, flexDirection: "row"}} onPress={handleLogout}>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 10, marginTop: 2.5 }}>Log Out</Text>
            <FontAwesomeIcon icon="fa-right-from-bracket" size={25} />
          </TouchableOpacity>
        </View>

      {/* profile banner */}
      <View>
      {/* top half */}
        <ImageBackground source={{uri: profileBannerImg}} style={styles.imageBanner}>
          <View style={{position: 'absolute', top: viewDimensions.height * .03}}>
            <View style={{ left: viewDimensions.width * 0.045 }}>
              <Image source={{uri: profilePic}} style={styles.profilePic}/>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={handleEditProfile}>
                <View style={[styles.bubble, {left: viewDimensions.width * 0.008 }]}>
                  <FontAwesomeIcon icon="fa-pencil" size={22}/>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.bubbleRow, {left: viewDimensions.width * 0.45, top: viewDimensions.height * 0.058 }]}>
              <Bubble value={user.eventsOwned.length} name={'Events'}/>
              <Bubble value={user.friends.length} name={'Connections'}/>
              <Bubble value={groups.length} name={'Groups'}/>
            </View>
          </View>
        </ImageBackground>

        {/* bottom half */}
        <View style={[styles.bioBanner, {top: viewDimensions.height * 0.09}]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 24, fontWeight: '700'}}>{user.firstName} {user.lastName}</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: "#D99BFF", marginLeft: 6}}>{age}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
            <FontAwesomeIcon icon="location-dot" color="#D186FF"/>  
            <Text style={{marginLeft: 5, fontSize: 16, fontWeight: '500', color: 'gray'}}>{user.primaryLocation}</Text>
          </View>
          <Text style={{marginTop: 8, fontSize: 16}}>{user.bio}</Text>

          <View style={styles.tagContainer}>
            {user.interests.map((tag, index) => {
                return (
                    <BubbleText key={index.toString()} title={tag} />
                )
            })}
          </View>
        </View>
      </View>

      <View style={{borderBottomWidth: 0.25, borderColor: 'gray'}}></View>

      {/* my events */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionText}>My Events</Text>
        </View>
      </View>

      <View style={{paddingHorizontal: 20}}>
        <MyEvents events={user.eventsOwned}/>
      </View>
        
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
    // borderBottomWidth: 0.25,
    // borderColor: 'gray',
    // top: 90,
    paddingHorizontal: 20,
    marginBottom: 90,
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
    // left: 15
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
    paddingHorizontal: 20,
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

export default ProfileUser;

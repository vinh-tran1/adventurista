import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Text, FlatList, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSelector, useDispatch } from 'react-redux';
import { setNewPost, selectUserInfo , setUserInfo} from '../../Redux/userSlice';

const FeedFixedTop = ({ navigation }) => {

  const user = useSelector(selectUserInfo);
  const dispatch = useDispatch();  
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/update-user';

  const [location, setLocation] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [notifications, setNotifications] = useState(user?.requests.incoming.length || 0);

  const toggleSearchBar = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSetLocation = async () => {
    try {
      const response = await axios.post(API_URL, {
          userId: user.userId,
          primaryLocation: location,
          firstName: user.firstName,
          lastName: user.lastName,
          interests: user.interests,
          age: user.age,
          bio: user.bio
        });

      if (response.status === 200) {
        const updatedUser = response.data;
        console.log("updated user location: ", updatedUser.primaryLocation);

        // do this so feed re-renders
        dispatch(setNewPost(true));
        dispatch(setUserInfo({
            ...updatedUser
          }));
        
        toggleSearchBar()
        console.log("Sucessfully updated user's location!");
      } else {
        console.log("Error in updating user's location");
      }  
    } catch (err) {
        console.log(err);
        console.log("An error occured for updating user's location. Please try again");
    
    };
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Image style={styles.logo} source={require('../../assets/logo.png')}/>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <FontAwesomeIcon style={{ marginTop: 20 }} icon="fa-bell" size={25} />
          </TouchableOpacity>
          {notifications > 0 && 
            <View style={{ marginTop: 10, height: 20, width: 20, backgroundColor: '#EDDBFF', padding: 2, borderRadius: 10, borderWidth: 1, borderColor:'#D186FF' }}>
              <Text style={{ textAlign: 'center', fontSize: 10 }}>{notifications}</Text>
            </View>
          }
          
        </View>
        
      </View>
      <View style={styles.topBar}>

        {!isSearchVisible ? 
          <TouchableOpacity testID="searchbar1" style={styles.location} onPress={toggleSearchBar}>
            <FontAwesomeIcon style={{ marginRight: 5 }} color={"#D186FF"} icon="location-dot" size={20} />
            <Text style={{ marginTop: 2, fontSize: 14 }}>{user?.primaryLocation || 'New Haven, CT'}</Text>
          </TouchableOpacity>
          :
          <View style={styles.searchBar}>
            <FontAwesomeIcon color={"#D99BFF"} icon="magnifying-glass" size={20} />
            <TextInput 
              value={location} 
              placeholder="New Haven, CT" 
              onChangeText={(text) => setLocation(text)} 
              style={{ marginLeft: 10, flex: 1 }} 
            />
            <TouchableOpacity 
                  testID="searchbar2" 
                  style={{ marginLeft: 8, borderWidth: 1.5,  borderColor: '#D99BFF', paddingHorizontal: 6, paddingVertical: 4, backgroundColor: 'white', borderRadius: 5 }} 
                  onPress={handleSetLocation}
            >
              <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '600' }}>Search</Text>
            </TouchableOpacity>
          </View>
        }

        {isSearchVisible && 
          <View>
            <TouchableOpacity 
              onPress={toggleSearchBar}
              style={{ marginLeft: 10, backgroundColor:'#D99BFF', borderWidth: 2, borderColor: '#EDD3FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5 }}>
              <Text style={{ textAlign: 'center', color: 'black', fontWeight: '800', fontSize: 20 }}>X</Text>
            </TouchableOpacity>
          </View>
        }
        
        
        {/* <TouchableOpacity style={{ marginTop: 7.5 }}>
          <FontAwesomeIcon color={"#D99BFF"} icon="magnifying-glass" size={20} />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 0.25,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  topBar: {
    paddingHorizontal: 20,
    marginVertical: 12.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center'
  },
  logo: {
    height: 60,
    width: 200,
  },
  location: {
    flexDirection: "row",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5
  },
  searchBar: {
    flexDirection: "row",
    width: '85%',
    alignItems: 'center',
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5
  }
});

export default FeedFixedTop;
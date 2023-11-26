import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, TextInput, ImageBackground, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../../Redux/userSlice";

const EditProfile = ({ navigation }) => {
  
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/update-user';

  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [interests, setInterests] = useState([]);
  const [tempInterest, setTempInterest] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge]= useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      handleImage(result.assets[0].uri);
    }
  };
  
  const handleProfileImage = (img) => {
    setProfileImage(img);
  };

  const handleBannerImage = (img) => {
    setBannerImage(img);
  };

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setProfileImage("");
    setBannerImage("");
    setLocation("");
    setBio("");
    setInterests([]);
    setAge("");
  };

  // need update state of user for events posted right
  const handleSaveProfile = async () => {
    try {
        const response = await axios.post(API_URL, {
            userId: user.userId,
            primaryLocation: location,
            firstName: firstName,
            lastName: lastName,
            interests: interests,
            age: age,
            bio: bio
      });

      if (response.status === 200) {
        const updatedUser = response.data;

        dispatch(setUserInfo({
            newPost: false,
            ...updatedUser
          }));

        handleClear();
        navigation.goBack();
        console.log("Sucessfully updated user!");
      } else {
        console.log("Error in udpating user");
      }  
    } catch (err) {
        console.log(err);
        console.log("An error occured for updating user. Please try again");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}> */}

            {/* header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon icon="fa-caret-left" size={30} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', marginLeft: 8}}>
                    <Text style={styles.headerText}>{user.firstName} {user.lastName}</Text>
                </View>
              </View>

              {/* nav buttons on top bar */}
              <View style={styles.topBar}>
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.navButton}>Clear</Text>
                </TouchableOpacity>

                <Text style={{fontSize:20, fontWeight: "600"}}>Edit Profile</Text>

                <TouchableOpacity onPress={handleSaveProfile} style={styles.navButton}>
                  <Text style={styles.navButton}>Save</Text>
                </TouchableOpacity>
              </View>

              {/* image */}
              <View style={styles.centerContainer}>
                <View style={styles.image}>
                  <TouchableOpacity onPress={pickImage}>
                    {profileImage.length === 0 ?
                    <Text style={{fontSize: 75, fontWeight: '700', color:'#D186FF'}}>+</Text>
                    :
                    <ImageBackground style={styles.image} source={{uri: image}} />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {/* text inputs */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>What?</Text>
                <TextInput 
                  value={firstName} 
                  placeholder="First Name" 
                  onChangeText={(text) => setFirstName(text)} 
                  style={styles.input} 
                />
              </View>

              {/* Location */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Where?</Text>
                <TextInput 
                  value={location} 
                  placeholder="Location" 
                  onChangeText={(text) => setLocation(text)} 
                  style={styles.input} 
                />
              </View>

              {/* Caption */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Bio</Text>
                <TextInput 
                  value={bio} 
                  placeholder="Describe the event!" 
                  multiline={true}
                  maxLength={100}
                  numberOfLines={5}
                  onChangeText={(text) => setBio(text)} 
                  style={styles.largeInput} 
                />
              </View>
            {/* </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView> */}
      </ScrollView> 
    </SafeAreaView>
  );
};

const inputStyle = {
  paddingVertical: 10,
  paddingLeft: 10,
  borderWidth: 0.25,
  borderColor: "#D186FF",
  backgroundColor: "rgba(243, 232, 255, 0.45)",
  marginBottom: 5,
  borderRadius: 5,
  color: 'gray'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 0.25,
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold" 
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  navButton: {
    fontSize: 16, 
    fontWeight: '500', 
    color:'#D186FF',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(243, 232, 255, 0.45)',
    borderWidth: 0.25,
    borderColor: "#D186FF",
    height: 110,
    width: 110
  },
  inputContainer: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 5
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: "bold"
  },
  input: {
    ...inputStyle
  },
  smallInput: {
    ...inputStyle,
    width: 80,
    alignContent: 'center',
    justifyContent: 'center',
  },
  largeInput: {
    ...inputStyle,
    height: 120
  }
});

export default EditProfile;


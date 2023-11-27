import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, TextInput, ImageBackground, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";
import BubbleText from "../../Shared/BubbleText";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectUserInfo, setUserInfo } from "../../Redux/userSlice";

const EditProfile = ({ navigation }) => {
  
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'users/update-user';

  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [interests, setInterests] = useState(user.interests);
  const [tempInterest, setTempInterest] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [location, setLocation] = useState(user.primaryLocation);
  const [bio, setBio] = useState("");
  const [age, setAge]= useState(user.age);

  const pickProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      handleProfileImage(result.assets[0].uri);
    }
  };

  const pickBannerImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      handleBannerImage(result.assets[0].uri);
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

  const handleAddInterest = () => {
    let updated = interests;
    updated.push(tempInterest);
    setInterests(updated);
    setTempInterest("");
}

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
        console.log(updatedUser)

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

//   console.log(firstName, lastName)
//   console.log(interests)
//   console.log(age)
//   console.log(bio)
//   console.log(location)
//   console.log(user.userId)
console.log(user)

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

        {/* profile and banner image */}
        <View style={styles.sectionContainer}> 
            <Text style={styles.label}>Edit Profile and Banner</Text>
            <View style={styles.centerContainer}>
                <View style={styles.image}>
                    <TouchableOpacity onPress={pickProfileImage}>
                        {profileImage.length === 0 ?
                        <Text style={{fontSize: 75, fontWeight: '700', color:'#D186FF'}}>+</Text>
                        :
                        <ImageBackground style={styles.image} source={{uri: profileImage}} />
                        }
                    </TouchableOpacity>
                    <Text style={{ marginBottom: 2 }}>Profile</Text>
                    </View>
                    <View style={styles.image}>
                    <TouchableOpacity onPress={pickBannerImage}>
                        {bannerImage.length === 0 ?
                        <Text style={{fontSize: 75, fontWeight: '700', color:'#D186FF'}}>+</Text>
                        :
                        <ImageBackground style={styles.image} source={{uri: bannerImage}} />
                        }
                    </TouchableOpacity>
                    <Text style={{ marginBottom: 2 }}>Banner</Text>
                </View>
            </View>
        </View>

        {/* name inputs */}
        <View style={styles.sectionContainer}>
            <Text style={styles.label}>Edit First Name</Text>
            <TextInput 
                value={firstName} 
                placeholder="First Name" 
                onChangeText={(text) => setFirstName(text)} 
                style={styles.input} 
            />
            <Text style={styles.label}>Edit Last Name</Text>
            <TextInput 
                value={lastName} 
                placeholder="Last Name" 
                onChangeText={(text) => setLastName(text)} 
                style={styles.input} 
            />
        </View>

         {/* Location */}
        <View style={styles.sectionContainer}>
            <Text style={styles.label}>Edit Location</Text>
            <TextInput 
                value={location} 
                placeholder="Location" 
                onChangeText={(text) => setLocation(text)} 
                style={styles.input} 
            />
        </View>

        {/* Interests */}
        <View style={ styles.sectionContainer}>
            <View>
                <Text style={styles.label}>Edit Interests {interests.length === 3 ? "" : "(" + (3 - interests.length) + " Required)"}</Text>
                {interests.length < 3 &&
                    <View style={{ flexDirection: "row" }}>
                        <TextInput value={tempInterest} onChangeText={(text) => setTempInterest(text)} placeholder='i.e. food' style={styles.tagInput} />
                        <TouchableOpacity onPress={handleAddInterest}>
                            <FontAwesomeIcon style={{ marginTop: 5, marginLeft: 15 }} icon="fa-add" size={25} color='#D186FF' />
                        </TouchableOpacity>
                    </View>
                }
                <View style={{ flexDirection: "row", paddingTop: 10 }}>
                {interests.length > 0 && interests.map((tag, index) => {
                    return (
                        <BubbleText key={index} title={tag} />
                    );
                })}
                {interests.length === 3 &&
                    <TouchableOpacity onPress={() => setInterests([])}>
                        <FontAwesomeIcon style={{ marginTop: 2.5, marginLeft: 15 }} icon="fa-xmark" size={25} />
                    </TouchableOpacity>
                }
                </View>
            </View>
        </View>

        {/* Age */}
        <View style={styles.sectionContainer}>
            <Text style={styles.label}>Edit Date of Birth (YYYY-MM-DD)</Text>
            <TextInput 
                value={age} 
                placeholder="1701-09-10"
                onChangeText={(text) => setAge(text)} 
                style={styles.input} 
            />
        </View>
                
        {/* Caption */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Edit Bio</Text>
            <TextInput 
                value={bio} 
                placeholder="Bios are overrated!" 
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
    paddingBottom: 10,
    borderBottomWidth: 0.25,
    borderColor: 'gray'
  },
  navButton: {
    fontSize: 16, 
    fontWeight: '500', 
    color:'#D186FF',
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 70,
    paddingBottom: 10,
  },
  sectionContainer: {
    paddingHorizontal: 20, 
    paddingBottom: 20,
    borderBottomWidth: 0.25, 
    borderColor: 'gray',
    marginVertical: 5
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
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 20
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
  },
  tagInput: {
    paddingVertical: 10,
    paddingLeft: 10,
    borderWidth: 0.25,
    borderColor: "#717171",
    backgroundColor: "rgba(243, 232, 255, 0.45)",
    marginBottom: 5,
    borderRadius: 5,
    width: 275
  }
});

export default EditProfile;


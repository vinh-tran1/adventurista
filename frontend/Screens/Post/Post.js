import React, { useEffect, useState } from "react";
import axios from "axios";
import { StyleSheet, Text, SafeAreaView, ScrollView, View, TouchableOpacity, TextInput, ImageBackground, Image, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";
import SelectDate from "./SelectDate";
import Tags from "./Tags";
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectNewPost, setNewPost, selectUserInfo, setUserInfo } from '../../Redux/userSlice';

const Post = ({ navigation }) => {
  
  const API_URL = process.env.REACT_APP_AWS_API_URL + 'events/event/create';

  const dispatch = useDispatch();
  const user = useSelector(selectUserInfo);
  //  console.log(user.eventsGoingTo, user.eventsOwned)

  const [image, setImage] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [caption, setCaption] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [selectTags, setSelectTags] = useState([]);
  const [moreTagsClicked, setMoreTagsClicked] = useState(1);
  
  //const img = 'https://i.etsystatic.com/8606357/r/il/144257/2449311457/il_570xN.2449311457_3lz9.jpg';

  const tags1 = [
    'catan', 'paddle', 'drinks', 'social',
    'drives', 'school', 'student', 'energy',
    'beach', 'hike', 'food', 'squash', 
    'cs', 'games', 'dinner', 'apps'
  ];
  const tags2 = [
    'travel', 'music', 'movies', 'gym',
    'cook', 'read', 'garden', 'art',
    'shop', 'photos', 'coding', 'sports',
    'tennis', 'nature', 'write', 'fashion',
  ];
  const tags3 = [
    'poetry', 'dance', 'pizza', 'guitar',
    'walks', 'coffee', 'explore', 'water',
    'ocean', 'books', 'lawn', 'yoga',
    'paint', 'films', 'hiking', 'chess',
  ];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
  const dates = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
  const days = ['MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'];
  const times = [
    "00:00", "00:30",
    "01:00", "01:30",
    "02:00", "02:30",
    "03:00", "03:30",
    "04:00", "04:30",
    "05:00", "05:30",
    "06:00", "06:30",
    "07:00", "07:30",
    "08:00", "08:30",
    "09:00", "09:30",
    "10:00", "10:30",
    "11:00", "11:30",
    "12:00", "12:30",
    "13:00", "13:30",
    "14:00", "14:30",
    "15:00", "15:30",
    "16:00", "16:30",
    "17:00", "17:30",
    "18:00", "18:30",
    "19:00", "19:30",
    "20:00", "20:30",
    "21:00", "21:30",
    "22:00", "22:30",
    "23:00", "23:30"
  ];

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
  
  const handleImage = (img) => {
    setImage(img);
  };
  const handleMonth = (val) => {
    setMonth(val);
    console.log(val);
  };
  const handleDate = (val) => {
    setDate(val);
    console.log(val);
  };
  const handleDay = (val) => {
    setDay(val);
    console.log(val);
  };
  const handleTime = (val) => {
    setTime(val);
    console.log(val);
  };
  const handleSelectTags = (tag) => {
    return selectTags.includes(tag);
  };

  const handleTagPress = (tag) => {
    if (selectTags.includes(tag)) {
      setSelectTags((prevTags) => prevTags.filter((selectedTag) => selectedTag !== tag));
    } else if (selectTags.length < 3) {
      setSelectTags((prevTags) => [...prevTags, tag]);
    }
    console.log(selectTags);
  };

  const handleClear = () => {
    setImage("");
    setEventName("");
    setLocation("");
    setCaption("");
    setMonth("");
    setDate("");
    setDay("");
    setTime("");
    setSelectTags("");
    setMoreTagsClicked(1);
  };

  // need update state of user for events posted right
  const handlePost = async () => {
    try {
      // const response = await axios.post('https://weaapwe0j9.execute-api.us-east-1.amazonaws.com/events/event/create', {
        const response = await axios.post(API_URL, {
          title: eventName,
          description: caption,
          date: day + ", " + month + " " + date,
          time: time,
          location: location, 
          postingUserId: user.userId,
          tags: selectTags,
          eventPictureUrl: 'https://images.squarespace-cdn.com/content/v1/5fc81abe9637537b99122e0b/1644296557746-M4AD4B5SYWQT9P9GAK6U/3M2A0998.jpg'
      });
      if (response.status === 201) {
        const updatedUser = response.data;
        // console.log(JSON.stringify(updatedUser, null, 2));

        dispatch(setNewPost(true));
        dispatch(setUserInfo({
          ...updatedUser
        }));

        handleClear();
        navigation.navigate('Feed Main');
        console.log("sucessfully created event!");
      } else {
        console.log("error in creating event");
      }  
    } catch (err) {
        console.log(err);
        console.log("An error occured for creating events. Please try again");
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
                <Text style={styles.headerText}>New Event</Text>
                <TouchableOpacity style={{marginTop: 6}}>
                  <FontAwesomeIcon icon="fa-gear" size={25} />
                </TouchableOpacity>
              </View>

              {/* nav buttons on top bar */}
              <View style={styles.topBar}>
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.navButton}>Clear</Text>
                </TouchableOpacity>

                <Text style={{fontSize:20, fontWeight: "600"}}>Event Details</Text>

                <TouchableOpacity onPress={handlePost} style={styles.navButton}>
                  <Text style={styles.navButton}>Post</Text>
                </TouchableOpacity>
              </View>

              {/* image */}
              <View style={styles.centerContainer}>
                <View style={styles.image}>
                  <TouchableOpacity onPress={pickImage}>
                    {image.length === 0 ?
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
                  value={eventName} 
                  placeholder="Event Name" 
                  onChangeText={(text) => setEventName(text)} 
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

              {/* Date */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>When?</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <SelectDate title={"Month"} data={months} func={handleMonth}/>
                  <SelectDate title={"Date"} data={dates} func={handleDate}/>
                  <SelectDate title={"Day"} data={days} func={handleDay}/>
                  <SelectDate title={"Time"} data={times} func={handleTime}/>
                </View>
              </View>

              {/* Caption */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Caption</Text>
                <TextInput 
                  value={caption} 
                  placeholder="Describe the event!" 
                  multiline={true}
                  maxLength={100}
                  numberOfLines={5}
                  onChangeText={(text) => setCaption(text)} 
                  style={styles.largeInput} 
                />
              </View>

              {/* Tags */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tags (max 3)</Text>
                <View style={styles.tagContainer}>
                  <Tags tags={tags1} select={handleSelectTags} press={handleTagPress}/>
                  {moreTagsClicked >= 2 && <Tags tags={tags2} select={handleSelectTags} press={handleTagPress}/>}
                  {moreTagsClicked >= 3 && <Tags tags={tags3} select={handleSelectTags} press={handleTagPress}/>}
                </View>
              </View>
              
              {/* Load More Tags */}
              {moreTagsClicked < 3 ?
              <View style={styles.moreTags}>
                  <TouchableOpacity 
                    onPress = {() => setMoreTagsClicked(moreTagsClicked + 1)}
                    style={{backgroundColor: '#D186FF', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5}}>
                      <Text style={{fontWeight: '500', color: 'white'}}>more</Text>
                  </TouchableOpacity>
              </View> :
              <View style={styles.moreTags}>
                  <TouchableOpacity 
                    onPress = {() => setMoreTagsClicked(1)}
                    style={{backgroundColor: '#D186FF', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 5}}>
                      <Text style={{fontWeight: '500', color: 'white'}}>less</Text>
                  </TouchableOpacity>
              </View>
              }
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
  // innerContainer: {
  //   flex: 1,
  //   justifyContent: 'space-around'
  // },
  header: {
    marginVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 0.25,
    flexDirection: 'row',
    justifyContent: 'space-between'
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
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Evenly space the columns
  },
  tag: {
    width: '25%',
    paddingVertical: 10,
  },
  selectedTag: {
    width: '25%',
    paddingVertical: 10,
    backgroundColor: '#D186FF', 
    borderRadius: 20,
  },
  moreTags: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    marginBottom: 20
  }
});

export default Post;


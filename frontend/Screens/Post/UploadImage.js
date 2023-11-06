import { StyleSheet, Text, SafeAreaView, ScrollView, View, Image, TouchableOpacity, TextInput, ImageBackground} from 'react-native';

const UploadImage = ( {img} ) => {
    // const uri = 'https://user-profile-picture-bucket.s3.amazonaws.com/2730e74f-5d85-4b02-9bf6-abb8f75e7a21.jpg';
    return (
        <View style={styles.centerContainer}>
          <Text style={{marginBottom: 5}}>add image</Text>
          <View style={styles.image}>
            <TouchableOpacity>
              {/* <ImageBackground style={styles.image} source={{uri: uri}}> */}
                <Text style={{fontSize: 75, fontWeight: '700', color:'#D186FF'}}>+</Text>
              {/* </ImageBackground> */}
            </TouchableOpacity>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 10,
      backgroundColor: 'rgba(243, 232, 255, 0.45)',
      borderWidth: 0.25,
      borderColor: "#D186FF",
      height: 110,
      width: 110
    }
  });

export default UploadImage;

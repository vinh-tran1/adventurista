import { StyleSheet, Text, SafeAreaView, ScrollView, View, Image, TouchableOpacity, TextInput} from 'react-native';

const UploadImage = () => {

    return (
        <View style={styles.centerContainer}>
          <Text style={{marginBottom: 5}}>add image</Text>
          <View style={styles.image}>
            <TouchableOpacity>
                <Text style={{fontSize: 75, fontWeight: '700', color:'#D186FF'}}>+</Text>
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

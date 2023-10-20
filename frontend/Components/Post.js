import { View, Text, Image, ImageBackground, StyleSheet} from 'react-native';

const Post = props => {
    return (
        <View style={styles.postContainer}>
            <ImageBackground source={{uri: props.img}} style={styles.postTop}>
                <View style={styles.postHeader}>
                    <Text style={{fontSize: 30}}>{props.title}</Text>
                </View>
                
            </ImageBackground>
            <View style={styles.postBottom}>
                <Text>{props.caption}</Text>
            </View>
        </View>
    )
  };

  const styles = StyleSheet.create({
    postContainer: {
        width: '100%',
        paddingVertical: 5,
    },
    postTop: {
        height: 456, 
        width: '100%',
        backgroundColor: 'gray',
    },
    postBottom: {
        height: 112, 
        width: '100%',
        backgroundColor: '#fff',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    postHeader: {
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        paddingVertical: 5,
        paddingHorizontal: 20 
    }
  });
  
  export default Post;
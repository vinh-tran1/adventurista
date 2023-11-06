import { View, Text, StyleSheet} from 'react-native';

const Bubble = (props) => {
    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.bubble}>
                <Text style={styles.bubbleText}>{props.value}</Text>
            </View>
            <View>
                <Text style={{fontWeight: '600', fontSize: 12}}>{props.name}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bubble: {
        height: 50,
        width: 50,
        borderRadius: 50/2, 
        borderWidth: 2,
        borderColor: "#EDDBFF",
        backgroundColor: "#fff",
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2
      },
      bubbleText: {
        fontSize: 18,
        fontWeight: '700'
      },
})

export default Bubble;
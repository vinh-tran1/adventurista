import { View, Text, StyleSheet, Dimensions} from 'react-native';
import React, { useEffect, useState } from "react";

const Bubble = (props) => {
    const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const { width, height } = Dimensions.get('window');
        setViewDimensions({ width, height });
      }, []);

    return (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View testID="bubble-component" style={[styles.bubble, {marginHorizontal: viewDimensions.width * 0.02 }]}>
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
        // marginHorizontal: 10,
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
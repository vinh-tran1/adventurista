import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import BubbleText from '../../Shared/BubbleText';

const Tags = ({ tags, select, press }) => {
    return (
        <View style={styles.tagContainer}>
            {tags.map((tag, index) => {
                const isSelected = select(tag); // Check if the tag is selected
                return (
                <TouchableOpacity
                    key={index.toString()}
                    onPress={() => press(tag)}
                    // style={[styles.tag, isSelected && styles.selectedTag]}
                    style={styles.tag}
                >
                    <BubbleText title={tag} disabled={isSelected}/>
                </TouchableOpacity>
                );
            })}
        </View>
    )
};

const styles = StyleSheet.create({
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
    }
});

export default Tags;

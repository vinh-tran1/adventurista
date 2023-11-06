import { StyleSheet, View, Text, Image } from 'react-native';

const MyGroups = ({ img, name }) => {
  return (
    <View style={styles.container}>
        <Image source={{ uri: img }} style={styles.circle} />
        <Text style={styles.caption}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 70/2,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: '#EDDBFF'
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    color: 'gray'
  }
});

export default MyGroups;

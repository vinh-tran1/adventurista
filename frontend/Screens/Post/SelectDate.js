import React, {useState, useEffect, useRef} from 'react';
import SelectDropdown from 'react-native-select-dropdown'
import {View, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const SelectDate = ({ title, data }) => {
    const [selectedItem, setSelectedItem] = useState(title);

    const handleSelection = (selectedItem) => {
        setSelectedItem(selectedItem);
        console.log(selectedItem);
      };
      
    return (
        <View style={styles.dropdownsRow}>
             <SelectDropdown
                data={data}
                // defaultValueByIndex={1}
                // defaultValue={'Egypt'}
                onSelect={handleSelection}
                defaultButtonText={selectedItem}
                buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                    return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#D186FF'} size={14} />;
                }}
                dropdownIconPosition={'right'}
                dropdownStyle={styles.dropdown1DropdownStyle}
          />
      </View>
    );
}

const styles = StyleSheet.create({
    dropdownsRow: {
        flexDirection: 'row', 
        width: 90,
    },
    dropdown1BtnStyle: {
      flex: 1,
      height: 40,
      backgroundColor: "rgba(243, 232, 255, 0.45)",
      borderRadius: 8,
      borderWidth: 1,
      borderWidth: 0.25,
      borderColor: "#D186FF",
      marginBottom: 5,
      borderRadius: 5,
    },
    dropdown1BtnTxtStyle: {
        color: 'gray', 
        textAlign: 'center',
        fontSize: 14
    },
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  });

export default SelectDate;

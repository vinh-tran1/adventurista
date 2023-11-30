import SelectDropdown from 'react-native-select-dropdown'
import {View, StyleSheet} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const SelectDate = ({ title, data, func }) => {
  
  const handleSelection = (selectedItem) => {
        func(selectedItem);
      };
      
    return (
        <View testID='select-date-button' style={styles.dropdownsRow}>
             <SelectDropdown
                data={data}
                onSelect={handleSelection}
                defaultButtonText={title}
                buttonTextAfterSelection={(selectedItem) => {
                    return selectedItem;
                }}
                buttonStyle={styles.dropdown1BtnStyle}
                buttonTextStyle={styles.dropdown1BtnTxtStyle}
                renderDropdownIcon={isOpened => {
                    return <FontAwesomeIcon icon={isOpened ? 'chevron-up' : 'chevron-down'} color={'#D186FF'} size={14} />;
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

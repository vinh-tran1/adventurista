import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from "./Navigators/MainNavigator";

// Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

// Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faHouse, faMagnifyingGlass, faMessage, faUser, faCalendar, faPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faHouse, faMagnifyingGlass, faMessage, faUser, faCalendar, faPlus);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

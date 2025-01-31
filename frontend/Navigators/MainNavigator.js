import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Stacks
import FeedNavigator from "./FeedNavigator";
import CalendarNavigator from "./CalendarNavigator";
import PostNavigator from "./PostNavigator";
import SavedEventsNavigator from "./SavedEventsNavigator";
import ProfileNavigator from "./ProfileNavigator";
import AuthenticationNavigator from "./AuthenticationNavigator";

// Redux
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn } from '../Redux/userSlice';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const dispatch = useDispatch();

    if (isLoggedIn) {
        return (
            <Tab.Navigator
                initialRouteName="Feed"
                screenOptions={{
                  keyboardHidesTabBar: true,
                  tabBarShowLabel: false,
                  tabBarActiveTintColor: "#D99BFF",
                  tabBarInactiveTintColor: "#777777"
                }}
            >
                <Tab.Screen
                name="Feed"
                component={FeedNavigator}
                options={{
                    tabBarIcon: () => (
                      <FontAwesomeIcon icon="house" size={25} />
                    ),
                    headerShown: false
                  }}
                />
                <Tab.Screen
                name="Calendar"
                component={CalendarNavigator}
                options={{
                    tabBarIcon: () => (
                      <FontAwesomeIcon icon="calendar" size={25} />
                    ),
                    headerShown: false
                  }}
                />
                <Tab.Screen
                name="Post"
                component={PostNavigator}
                options={{
                    tabBarIcon: () => (
                      <FontAwesomeIcon icon="plus" size={25} />
                    ),
                    headerShown: false
                  }}
                />
                <Tab.Screen
                name="Saved Events"
                component={SavedEventsNavigator}
                options={{
                    tabBarIcon: () => (
                      <FontAwesomeIcon icon="bookmark" size={25} />
                    ),
                    headerShown: false
                  }}
                />
                <Tab.Screen
                name="Profile"
                component={ProfileNavigator}
                options={{
                    tabBarIcon: () => (
                      <FontAwesomeIcon icon="user" size={25} />
                    ),
                    headerShown: false
                  }}
                />
            </Tab.Navigator>
        );
    } else {
        return <AuthenticationNavigator />;
    }
};

export default MainNavigator;
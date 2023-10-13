import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// Stacks
import FeedNavigator from "./FeedNavigator";
import CalendarNavigator from "./CalendarNavigator";
import PostNavigator from "./PostNavigator";
import MessagesNavigator from "./MessagesNavigator";
import ProfileNavigator from "./ProfileNavigator";
import AuthenticationNavigator from "./AuthenticationNavigator";

// Screens

// Redux

const Tab = createBottomTabNavigator();

const MainNavigator = () => {

    const isLoggedIn = false;

    if (isLoggedIn) {
        return (
            <Tab.Navigator
                initialRouteName="Feed"
                screenOptions={{
                keyboardHidesTabBar: true,
                tabBarShowLabel: false
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
                name="Messages"
                component={MessagesNavigator}
                options={{
                    tabBarIcon: () => (
                      <FontAwesomeIcon icon="message" size={25} />
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
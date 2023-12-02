import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Feed from '../Screens/Feed/Feed';
import Notifications from '../Screens/Feed/Notifications/Notifications';
import FriendProfileView from '../Screens/Profile/FriendProfileView';
import EventCard from '../Shared/EventCard';
import EventDetails from '../Shared/EventDetails';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Feed Main'
                component={Feed}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Notifications'
                component={Notifications}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='FriendProfileView'
                component={FriendProfileView}
                options={{
                    headerShown: false,
                }}
            />
            {/* <Stack.Screen 
                name='Event Card'
                component={EventCard}
                options={{
                    headerShown: false,
                }}
            /> */}
            <Stack.Screen 
                name='Event Details'
                component={EventDetails}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}

export default function FeedNavigator() {
    return <MyStack />;
}

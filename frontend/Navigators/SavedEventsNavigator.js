import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import SavedEvents from '../Screens/SavedEvents/SavedEvents';
import EventCard from '../Shared/EventCard';
import EventDetails from '../Shared/EventDetails';
import FriendProfileView from '../Screens/Profile/FriendProfileView';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Saved Events'
                component={SavedEvents}
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
            {/* <Stack.Screen 
                name='Friend Profile'
                component={FriendProfileView}
                options={{
                    headerShown: false,
                }}
            /> */}
        </Stack.Navigator>
    )
}

export default function SavedEventsNavigator() {
    return <MyStack />;
}
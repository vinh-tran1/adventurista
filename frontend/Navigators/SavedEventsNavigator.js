import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import SavedEvents from '../Screens/SavedEvents/SavedEvents';
import EventDetails from '../Shared/EventDetails';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Messages Main'
                component={SavedEvents}
                options={{
                    headerShown: false,
                }}
            />
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

export default function MessagesNavigator() {
    return <MyStack />;
}
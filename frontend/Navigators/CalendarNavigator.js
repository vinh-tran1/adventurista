import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Calendar from "../Screens/Calendar/Calendar";
import EventDetails from '../Shared/EventDetails';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Calendar Main'
                component={Calendar}
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

export default function CalendarNavigator() {
    return <MyStack />;
}
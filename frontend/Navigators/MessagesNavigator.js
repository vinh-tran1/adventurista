import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Messages from '../Screens/Messages/Messages';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Messages Main'
                component={Messages}
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
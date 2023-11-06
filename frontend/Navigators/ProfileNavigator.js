import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Profile from "../Screens/Profile/ProfileUser";

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Profile Main'
                component={Profile}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}

export default function ProfileNavigator() {
    return <MyStack />;
}
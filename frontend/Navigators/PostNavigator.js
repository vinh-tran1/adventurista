import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Post from "../Screens/Post/Post";

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Post Main'
                component={Post}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}

export default function PostNavigator() {
    return <MyStack />;
}
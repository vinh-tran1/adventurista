import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import ProfileUser from "../Screens/Profile/ProfileUser";
import EditProfile from "../Screens/Profile/EditProfile";

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='Profile Main'
                component={ProfileUser}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name='Edit Profile'
                component={EditProfile}
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
import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

// Screens
import Login from '../Screens/Authenticate/Login/Login';
import Signup from '../Screens/Authenticate/Signup/Signup';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator initialRouteName="Login Main">
            <Stack.Screen
                name="Login Main"
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Signup Main"
                component={Signup}
                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    );
}

export default function AuthenticationNavigator() {
    return <MyStack />;
}
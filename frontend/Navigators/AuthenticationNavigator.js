import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

// Screens
import Login from '../Screens/Authenticate/Login/Login';
import Signup from '../Screens/Authenticate/Signup/Signup';
import Step2 from '../Screens/Authenticate/Signup/Step2';

const Stack = createStackNavigator();

const MyStack = () => {
    return (
        <Stack.Navigator testID="stackNavigator" initialRouteName="Login Main">
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
            <Stack.Screen
                name="Step 2"
                component={Step2}
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
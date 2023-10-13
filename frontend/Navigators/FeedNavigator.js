import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"

import Feed from '../Screens/Feed/Feed';

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
        </Stack.Navigator>
    )
}

export default function FeedNavigator() {
    return <MyStack />;
}
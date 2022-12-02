import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderBook from './AppOrderBookScreen';
import TabScreen from './AppTab';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen
              name='Home'
              component={OrderBook}
              options={{ title: 'Order Book' }}
            />
            <Stack.Screen
              name='TabScreen'
              component={TabScreen}
              options={{ title: 'TabScreen' }}
            />
          </Stack.Navigator>
    </NavigationContainer>
  )
};

import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Page1 from './AppPage1';
import Page2 from './AppPage2';

const Tab = createBottomTabNavigator();

export default function TabScreen() {
  return (
    // <NavigationContainer independent='true'>
      <Tab.Navigator>
        <Tab.Screen name="Page1" component={Page1} />
        <Tab.Screen name="Page2" component={Page2} />
      </Tab.Navigator>
    // </NavigationContainer>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
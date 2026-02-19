import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from './src/screens/SearchScreen';
import DetailsSceen from './src/screens/DetailsScreen';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ headerShown: false }} // We have our own header
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsSceen}
          options={{ title: 'Movie Details' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
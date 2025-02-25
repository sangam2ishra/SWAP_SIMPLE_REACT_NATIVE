import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Signin from '../Screens/sigin',
import Signup from '../Screens/signup';
import { NavigationContainer } from '@react-navigation/native';

const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
    <Stack.Navigator>
    <Stack.Screen
        name="Signin"
        component={Signin}
        options={{ headerShown: false }}
      />
    
     <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />
     
      {/* <Stack.Screen
        name="Main"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Info"
        component={ProductInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Address"
        component={AddAddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Add"
        component={AddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Confirm"
        component={ConfirmationScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Order"
        component={OrderScreen}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  </NavigationContainer>
);
};


export default StackNavigation

const styles = StyleSheet.create({})
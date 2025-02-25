// MainNavigation.js

import React from 'react';
import { Pressable, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Home from '../Screens/Home';



import Signup from '../Screens/signup';
import toastConfig from '../toastConfig';
import SeatSelection from '../components/SeatSelection';
import SwapResults from '../Screens/SwapResults';
import All_request from '../Screens/All_request';

import About from '../Screens/About';
import Help from '../Screens/Help';
import Profile from '../Screens/Profile';
import Signin from '../Screens/Sigin';
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import NotificationPage from '../Screens/NotificationPage';
import { useNavigation } from '@react-navigation/native';



const darkTheme = {
  backgroundColor: '#1e293b',
  textColor: 'white',
  iconColor: 'white',
};

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: darkTheme.backgroundColor }}>
      <Profile />
    </View>
  );
}

function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: darkTheme.backgroundColor }}>
      <About />
    </View>
  );
}

function LoginScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: darkTheme.backgroundColor }}>
      <Signin />
      {/* <Toast config={toastConfig} /> */}
    </View>
  );
}

function SignupScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: darkTheme.backgroundColor }}>
      <Signup />
      {/* <Toast config={toastConfig} /> */}
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: darkTheme.backgroundColor }}>
      <Home />
    </View>
  );
}

function SeatSelectionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: darkTheme.backgroundColor }}>
      <SeatSelection />
    </View>
  );
}

function SwapResultsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: darkTheme.backgroundColor }}>
      <SwapResults />
    </View>
  );
}

function SwapResultsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: darkTheme.backgroundColor }}>
      {/* <Text style={{ color: darkTheme.textColor }}>Seat Selection Screen</Text>
       */}
       <SwapResults/>
    </View>
  );
}

function AllRequestsScreen() {
  const { currentUser } = useSelector((state) => state.user);
  return (

  

    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: "#1e293b" }}>
      {!currentUser?<Home/>:<All_request/>}
      {/* <All_request /> */}

    </View>
  );
}

function HelpScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: darkTheme.backgroundColor }}>
      <Help />
      {/* <NotificationPage/> */}
    </View>
  );
}
function NotificationScreen() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: '', backgroundColor: darkTheme.backgroundColor }}>
      {/* <Help /> */}
      {!currentUser?<Home/>:<NotificationPage/>}
      {/* <NotificationPage/> */}
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: darkTheme.backgroundColor },
        headerTintColor: darkTheme.textColor,
        headerRight: () => (
          <Ionicons
            name="notifications"
            size={25}
            color={darkTheme.iconColor}
            style={{ marginRight: 15 }}
            onPress={() => alert('Notifications clicked!')}
          />
        ),
      }}
    >
      <HomeStack.Screen name="HomeStackMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="SeatSelection" component={SeatSelectionScreen} options={{ headerShown: false }} />

      <HomeStack.Screen name="SwapResults" component={SwapResultsScreen} options={{ headerShown: false }} />

      <HomeStack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />

    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'AllRequests') {
            iconName = 'list';
          } else if (route.name === 'Help') {
            iconName = 'help-circle';
          }else if(route.name==='Profile'){
            iconName='person'
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: darkTheme.iconColor,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: darkTheme.backgroundColor },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="AllRequests"
        component={AllRequestsScreen}
        options={{ title: 'All Requests' }}
      />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: 'Help' }}
      />
      {currentUser?<Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />:<></>}
      {/* if(currentUser){
        
      } */}
      
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function MainNavigation() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigation=useNavigation();
  
  const handleSignout = async () => {
    console.log("Sign off");
    try {
      const res = await fetch(`http://10.10.92.56:3000/api/user/signout`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Drawer.Navigator
      initialRouteName="SwapSimple"
      screenOptions={{
        headerRight: () => (
          <Pressable onPress={() =>  navigation.navigate('Notification')}>
          <FontAwesome name="bell" size={20} color="#660000" style={{ marginRight: 15 }}  />
          </Pressable>
        ),
        drawerStyle: {
          backgroundColor: darkTheme.backgroundColor,
        },
        drawerLabelStyle: {
          color: darkTheme.textColor,
        },
        drawerActiveTintColor: darkTheme.iconColor,
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen
        name="SwapSimple"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="train-sharp" size={24} color={color} />
          ),
          title: 'Swap-Simple',
        }}
      />
      {currentUser ? (
        <>
          
        
        </>
      ) : (
        <>
          <Drawer.Screen
            name="Login"
            component={LoginScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="log-in" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="log-in" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

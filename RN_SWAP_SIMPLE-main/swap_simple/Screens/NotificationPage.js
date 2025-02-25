import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native'; // Import the hook
import NotificationCard from '../components/NotificationCard';
import Ionicons from '@expo/vector-icons/Ionicons';

const NotificationPage = () => {
  const user = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noNotifications, setNoNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  // Fetch notifications function (can be called on pull-to-refresh or page focus)
  const fetchNotifications = async () => {
    setLoading(true); // Ensure loading state is reset each time
    setNoNotifications(false); // Reset noNotifications to false each time
  
   console.log("Let me See ---",user.currentUser);

    if (!user.currentUser) {
      console.log("If then why so ");
      navigation.navigate('Home'); // Navigate to HomeScreen if no currentUser
      return; // Exit function early to avoid fetching notifications
    }

    try {
      const response = await fetch(
        `http://10.10.92.56:3000/api/pnr/getAllNotifications/${user.currentUser._id}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        } else {
          setNoNotifications(true);
        }
      } else {
        setNoNotifications(true);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNoNotifications(true);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refresh control spinner
    }
  };

  // Use focus effect to trigger fetchNotifications when the screen is focused
  // if(user.currentUser){
    console.log(user.currentUser);
    useFocusEffect(
      useCallback(() => {
        fetchNotifications();
      }, [user.currentUser])
    );
   
  // }
  

  // Handle pull-to-refresh
  // if(user.currentUser){
    
  // }
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Show the refresh control spinner
    fetchNotifications(); // Fetch notifications on refresh
  }, [user.currentUser]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (noNotifications) {
    return (
      <View style={styles.centered}>
        {/* <Text style={styles.emoji}>😭</Text> */}
        <Ionicons name="notifications-circle" size={100} color="white" />
        <Text style={styles.message}>😒 No notifications found. </Text>
        <Text style={styles.message}> Please wait for new notifications. </Text>
        <Text style={styles.message}>Thank you for your patience! 😊</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {notifications.map((notification) => (
        <NotificationCard
          key={notification._id}
          notificationId={notification._id}
          message={notification.message}
          subject={notification.subject}
          takeResponse={notification.takeResponse}
          active={notification.active}
          createdAt={notification.createdAt}
          seen={notification.seen}
          ownTravelId={notification.ownTravelId}
          otherTravelId={notification.otherTravelId}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'serif',
  },
  emoji: {
    fontSize: 72,
    textAlign: 'center',
  },
  message: {
    fontSize: 20,
    fontFamily: 'serif',
    textAlign: 'center',
    marginVertical: 4,
    padding:2,
    color:'white'
  },
});

export default NotificationPage;

// expoNotification.js
import { Expo } from 'expo-server-sdk';

// Create a new Expo SDK client
let expo = new Expo();

// Function to send notifications
export const sendExpoNotification = async (pushToken, message) => {
  // Check if the pushToken is a valid Expo push token
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return;
  }

  // Create a message object
  const messages = [{
    to: pushToken,
    sound: 'default',
    body: message,
    data: { withSome: 'data' },
    android: {
      icon: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDV8fGxpbmUlMjBpbWFnZXxlbnwwfHx8fDE2MjYzMDg4ODg&ixlib=rb-1.2.1&q=80&w=400'
    }
  }];
  

  try {
    // Send the notification
    let tickets = await expo.sendPushNotificationsAsync(messages);
    console.log(tickets);
  } catch (error) {
    console.error(error);
  }
};

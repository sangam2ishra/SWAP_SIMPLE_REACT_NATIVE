import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
// import { useSelector } from "react-redux";

export const registerForPushNotificationsAsync = async (userId) => {
  // const user=useSelector((state)=>state.user);
  // const userId=user.CurrentUser.id;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    
    console.log("Userid", userId);
    // Here, you can send the token to your backend server
    
    const response = await fetch(`http://10.10.92.56:3000/api/user/updateExpoToken/${userId}`, {
      method: 'PATCH', // or 'PUT' if you're updating the entire resource
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ExpoToken: token }),
    });

    if (!response.ok) {
      throw new Error('Failed to update Expo token on the server');
    }

    const responseData = await response.json();
    console.log('Expo token updated on server:', responseData);

    return token;
  } catch (error) {
    console.error("Error registering for push notifications:", error);
  }
};

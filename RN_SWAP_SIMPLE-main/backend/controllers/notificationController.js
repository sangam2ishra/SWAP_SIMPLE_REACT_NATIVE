//It is new one
import mongoose from "mongoose";
import moment from "moment";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import Swap from "../models/swapModel.js";
import Travel from "../models/travelModel.js";
import { sendExpoNotification } from "./expoNotification.js";

import 'dotenv/config';
import Request from "../models/requestModel.js";

export const getAllNotifications = async (req, res) => {
  // console.log("RKSAN");
  try {
    // Extract userId from the request parameters
    const { userId } = req.params;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // console.log(`Received request for fetching notifications for user ${userId}`);

    // Find the user by userId
    const user = await User.findById(userId);
    // console.log(user);
    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has notifications
    if (!user.notifications || user.notifications.length === 0) {
      // console.log("NO notification for the user");
      return res.status(404).json({ error: 'No notifications found for this user' });
    }

    // Sort notifications by createdAt in descending order (-1)
    // console.log("OH notfiy him");
    const sortedNotifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);

    // Send the sorted notifications
    res.status(200).json({ notifications: sortedNotifications });
  } catch (error) {
    // console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const markNotificationAsSeen = async (req, res) => {
  try {
    // Extract the userId and notificationId from the request parameters
    const { userId, notificationId } = req.params;
    // console.log("Mark nitfication section here")
    // console.log("userId", userId);
    // console.log("notificationId", notificationId);

    // Check if userId and notificationId are provided
    if (!userId || !notificationId) {
      return res.status(400).json({ error: 'User ID and Notification ID are required' });
    }

    // Find the user by userId
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the notification in the user's notifications array
    const notification = user.notifications.find(n => n._id.toString() === notificationId);

    // Check if notification exists
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Update the 'seen' property of the notification to true
    notification.seen = true;

    // Save the changes to the user object
    await user.save();

    // Send a success response
    res.status(200).json({ message: 'Notification marked as seen successfully' });
  } catch (error) {
    console.error('Error marking notification as seen:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deactivateNotification = async (req, res) => {
  try {
    // console.log("deactvitidfffffffffffff");
    const { userId, notificationId } = req.params;
    // console.log(userId);
    // console.log(notificationId);
    if (!userId || !notificationId) {
      return res.status(400).json({ error: 'User ID and Notification ID are required' });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // const notification = user.notifications.find(n => n._id.toString() === notificationId);
    const notification = user.notifications.find(n => n._id.toString() === notificationId);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.active = false;
    await user.save();
    res.status(200).json({ message: 'Notification deactivated successfully' });


  } catch (error) {
    // console.log('Error deactivating notification', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const deleteNotification = async (req, res) => {
  // console.log("I am inside deleteNotification");
  try {

    const notificationId = req.body.notificationId;
    const result = await User.updateOne({ "notifications._id": notificationId }, { $pull: { notifications: { _id: notificationId } } });
    if (result.nModified === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    // console.log("Error deleting notifications: ", error);
    res.status(500).json({ message: "Server error" });
  }

}
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "rustampavri1275@gmail.com",
    //"djyh phga iwhf nkyr"
    pass: "djyh phga iwhf nkyr",
  },
});

const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    // console.log("Email has been sent successfully");
  } catch (error) {
    // console.error("Error sending email", error);
    // Logging and returning instead of throwing error
  }
};

export const sendNotification = async ({ user1, user2, message1, message2, subject1, subject2, takeResponse1, takeResponse2, travelId1, travelId2 }) => {
  try {
    // console.log(user1);
    // console.log(user2);
    // const user1 = await User.findById(userId1);
    // const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      // console.error("User Not Found");
      return;
    }

    user1.notifications.push({ message: `${message1}`, subject: `${subject1}`, takeResponse: takeResponse1, ownTravelId: `${travelId1}`, otherTravelId: `${travelId2}` });
    user2.notifications.push({ message: `${message2}`, subject: `${subject2}`, takeResponse: takeResponse2, ownTravelId: `${travelId2}`, otherTravelId: `${travelId1}` });

    await user1.save();
    await user2.save();
    // console.log(user1.email);
    // console.log(user2.email);
    const emailOptions1 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user1.email,
      subject: "Swap-simple notifications",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Swap your Seat</h1>
          <div class="body-section">
            <p>🤗 Your request to swap your seat has been successfully made 📤 to  <b>${user2.username}</b>'s 😊</p>
            <hr />
            <p>Please wait for  <b>${user2.username}</b>'s  confirmation of the swap.</p>
            <p>Thank you for your patience.</p>
            <hr/>
            <p>For more details, please visit the <b>Notification</b>Notification section of our site.</p>
          </div>
          
          <div class="thank-you">
            <p>❤️ Thank you for using our service! ❤️</p>
            <p> Rustam & Sangam</p>
          </div>
        </div>
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };
    const emailOptions2 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user2.email,
      subject: "Swap-simple notifications",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          /* Add your CSS styles here */
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Swap your Seat</h1>
          <div class="body-section">
            <p>🤗 <b>${user1.username}</b> has requested🙏 to swap his/her seat with you. 😊</p>
            <hr />
            <p>Please confirm <b>${user1.username}</b>'s request if you want to swap, or deny it if you prefer not to.</p>
            <p>Thank you for your patience.</p>
            <hr/>
            <p>For more details, please visit the <b>Notification</b> section of our site.</p>
          </div>
           
          <div class="thank-you">
            <p>❤️ Thank you for using our service! ❤️</p>
            <p> Rustam & Sangam</p>
          </div>
        </div>
      </body>
    </html>
    
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };
    await sendMail(emailOptions1);
    await sendMail(emailOptions2);
    // console.log("Notifications sent successfully");
    
    const pushToken1=user1.ExpoToken;
    const pushToken2=user2.ExpoToken;

    if (pushToken1)
      sendExpoNotification(pushToken1, subject1);
    if (pushToken2)
      sendExpoNotification(pushToken2, subject2);
    
  } catch (error) {
    console.error("Error sending Notification", error);
    // Logging and returning instead of throwing error
  }
};

export const sendNotification2 = async ({ user1, user2, message1, message2, subject1, subject2, takeResponse1, takeResponse2, travelId1, travelId2 }) => {
  try {
    // console.log(user1);
    // console.log(user2);
    // const user1 = await User.findById(userId1);
    // const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      // console.error("User Not Found");
      return;
    }

    user1.notifications.push({ message: `${message1}`, subject: `${subject1}`, takeResponse: takeResponse1, ownTravelId: `${travelId1}`, otherTravelId: `${travelId2}` });
    user2.notifications.push({ message: `${message2}`, subject: `${subject2}`, takeResponse: takeResponse2, ownTravelId: `${travelId2}`, otherTravelId: `${travelId1}` });

    await user1.save();
    await user2.save();
    // console.log(user1.email);
    // console.log(user2.email);
    const emailOptions1 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user1.email,
      subject: "ConfirmYourSwap",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <h1>Swap Your Seat</h1>
      <div class="body-section">
          <p>🤗 We're thrilled to facilitate your seat swaps. You may confirm your swaps and communicate with your swapping partners through <span style="font-weight: bold; color: green;">${user2.username}</span> (<span style="font-weight: bold; color: red;">${user2.email}</span>).<br> Please feel free to share your contact details if you wish. 😊</p>
          <hr />
          <p>Please await final confirmation from <b style="color: green;">${user2.username}</b> regarding the swap. Your patience is greatly appreciated.</p>
          <p>For further inquiries, please visit the <b>Notification</b> section of the site.</p>
      </div>
      
      <div class="thank-you">
          <p>❤️ Thank you for choosing our service! ❤️</p>
          <p>Rustam & Sangam</p>
      </div>
  </div>
  
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };
    const emailOptions2 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user2.email,
      subject: "ConfirmYourSwap",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <h1>Swap Your Seat</h1>
      <div class="body-section">
          <p>🤗 We're thrilled to facilitate your seat swaps. You may confirm your swaps and communicate with your swapping partners through <span style="font-weight: bold; color: green;">${user1.username}</span> (<span style="font-weight: bold; color: red;">${user1.email}</span>).<br> Please feel free to share your contact details if you wish. 😊</p>
          <hr />
          <p>Please await final confirmation from <b style="color: green;">${user1.username}</b> regarding the swap. Your patience is greatly appreciated.</p>
          <p>For further inquiries, please visit the <b>Notification</b> section of the site.</p>
      </div>
      
      <div class="thank-you">
          <p>❤️ Thank you for choosing our service! ❤️</p>
          <p>Rustam & Sangam</p>
      </div>
  </div>
  
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };

    await sendMail(emailOptions1);
    await sendMail(emailOptions2);


    const pushToken1=user1.ExpoToken;
    const pushToken2=user2.ExpoToken;

    if (pushToken1)
      sendExpoNotification(pushToken1, subject1);
    if (pushToken2)
      sendExpoNotification(pushToken2, subject2);


    // console.log("Notifications sent successfully");
  } catch (error) {
    // console.error("Error sending Notification", error);
    // Logging and returning instead of throwing error
  }
};

export const swapRequestNotification = async (req, res) => {
  // console.log("Swap request notification");
  // console.log(req.body);

  //const {requesterId,accepterTravelId}=req.body;
  const { requesterTravelId, accepterTravelId } = req.body;


  try {
    const requesterTravel = await Travel.findById(requesterTravelId).populate('user');
    const accepterTravel = await Travel.findById(accepterTravelId).populate('user');

    // console.log("travel model");
    // console.log(requesterTravel);
    // console.log(accepterTravel);
    const requesterUser = requesterTravel.user;
    const accepterUser = accepterTravel.user;

    // console.log("requesting body" + requesterUser);
    // console.log("accepting body" + accepterUser);
    const PresentSeat = requesterTravel.passengerInfo;
    const WantedSeat = accepterTravel.passengerInfo;
    
    // console.log("present seat ");
    // console.log(PresentSeat);
    
    // Update PresentSeat by removing the _id property
    const updatedPresentSeat = PresentSeat.map(seat => {
        const { _id, ...rest } = seat._doc;
        return rest;
    });
    
    // console.log("updated present seat");
    // console.log(updatedPresentSeat);
    
    // Update WantedSeat by removing the _id property
    const updatedWantedSeat = WantedSeat.map(seat => {
        const { _id, ...rest } = seat._doc;
        return rest;
    });
    
    // console.log("updated wanted seat");
    // console.log(updatedWantedSeat);
    // Convert seat objects to strings
const presentSeatString = updatedPresentSeat.map(seat => `Coach: ${seat.currentCoach}, Berth: ${seat.currentBerthNo}`).join('; ');
const wantedSeatString = updatedWantedSeat.map(seat => `Coach: ${seat.currentCoach}, Berth: ${seat.currentBerthNo}`).join('; ');

const messageToAccepter = `Someone with ${presentSeatString} is requesting to swap seats with you`;
const messageToRequester = `You have successfully made a request to swap seats with seat ${wantedSeatString}`;

// console.log(messageToAccepter);
// console.log(messageToRequester);
    const subjectforRequester = "RequestSeatSwap";
    const subjectforAccepter = "AcceptSeatSwap";

    await sendNotification({
      // 6641dd09f5223bf77237b040
      //                          6641dd51f5223bf77237b07f
      user1: requesterUser,
      user2: accepterUser,
      message1: messageToRequester,
      message2: messageToAccepter,
      subject1: subjectforRequester,
      subject2: subjectforAccepter,
      takeResponse1: false,
      takeResponse2: true,
      travelId1: requesterTravelId,
      travelId2: accepterTravelId
    });
    // console.log("Notify him succeed");
    return res
      .status(200)
      .json({ message: "Swap request notification sent successfully", success: "true" });
  } catch (error) {
    console.error("Error sending swap request notification", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



export const acceptSwapRequest = async (req, res) => {
  const { travelId1, travelId2 } = req.body;

  try {

    // console.log("I am inside acceptSwapRequest");
    const travel1 = await Travel.findById(travelId1).populate('user');
    const travel2 = await Travel.findById(travelId2).populate('user');

    // const userId1 = travel1.user;
    // const userId2 = travel2.user;

    const user1 = travel1.user;
    const user2 = travel2.user;

    if (!user1 || !user2 || !travel1 || !travel2) {
      return res.status(404).json({ message: "User or Travel Not Found" });
    }

    const message1 = `You can confirm your swaps. You may communicate with your swapping partners through ${user2.username} (${user2.email}, Please Share your Contact details if you want.`;
    const message2 = `You can confirm your swaps. You may communicate with your swapping partners through ${user1.username} (${user1.email}, Please Share your Contact details if you want.`;

    const subject1 = "ConfirmYourSwap";
    const subject2 = "ConfirmYourSwap";

    const newSwap = new Swap({
      user1: user1,
      user2: user2,
      travel1: travel1._id,
      travel2: travel2._id,
    });

    await newSwap.save();

    await sendNotification2({
      user1: user1,
      user2: user2,
      message1: message1,
      message2: message2,
      subject1: subject1,
      subject2: subject2,
      takeResponse1: true,
      takeResponse2: true,
      travelId1: travel1._id,
      travelId2: travel2._id
    });
    // console.log("ACCEPT SEAT REQUEST");
    return res
      .status(200)
      .json({ message: "Contact information swapped successfully" });
  } catch (error) {
    console.error("Error accepting swap request", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};









export const sendNotification_Rejection = async ({ user1, user2, message1, message2, subject1, subject2, takeResponse1, takeResponse2, travelId1, travelId2 }) => {
  try {
    console.log(user1);
    // console.log(user2);
    // const user1 = await User.findById(userId1);
    // const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      // console.error("User Not Found");
      return;
    }

    user1.notifications.push({ message: `${message1}`, subject: `${subject1}`, takeResponse: takeResponse1, ownTravelId: `${travelId1}`, otherTravelId: `${travelId2}` });
    user2.notifications.push({ message: `${message2}`, subject: `${subject2}`, takeResponse: takeResponse2, ownTravelId: `${travelId2}`, otherTravelId: `${travelId1}` });

    await user1.save();
    await user2.save();
    // console.log(user1.email);
    // console.log(user2.email);
    const emailOptions1 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user1.email,
      subject: "Rejected",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <h1>Swap Your Seat</h1>
     <div class="body-section">
    <p>😔 We regret to inform you that your seat swap request has been canceled by 
        <span style="font-weight: bold; color: green;">${user2.username}</span> 
        (<span style="font-weight: bold; color: red;">${user2.email}</span>).
    </p>
    <hr />
    <p>We understand that this may be disappointing, and we appreciate your understanding and patience in this matter.</p>
    <p>For any further inquiries, please visit the <b>Notification</b> section of the site or contact our support team.</p>
</div>

<div class="thank-you">
    <p>❤️ Thank you for using our service! ❤️</p>
    <p>Rustam & Sangam</p>
</div>
  </div>
  
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };
    const emailOptions2 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user2.email,
      subject: "ConfirmYourSwap",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <h1>Swap Your Seat</h1>
      <div class="body-section">
      <p>We here to inform you that the seat swap request initiated by 
          <span style="font-weight: bold; color: green;">${user1.username}</span> 
          (<span style="font-weight: bold; color: red;">${user1.email}</span>) 
          has been canceled as per your request.
      </p>
      <hr />
      <p>If you have any questions or need further assistance, please feel free to reach out to us.</p>
      <p>For any further inquiries, please visit the <b>Notification</b> section of the site or contact our support team.</p>
  </div>
  
  <div class="thank-you">
      <p>❤️ Thank you for using our service! ❤️</p>
      <p>Rustam & Sangam</p>
  </div>
  </div>
  
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };

    await sendMail(emailOptions1);
    await sendMail(emailOptions2);
    // console.log("Notifications sent successfully");

    const pushToken1=user1.ExpoToken;
    const pushToken2=user2.ExpoToken;

    if (pushToken1)
      sendExpoNotification(pushToken1, subject1);
    if (pushToken2)
      sendExpoNotification(pushToken2, subject2);

  } catch (error) {
    console.error("Error sending Notification", error);
    // Logging and returning instead of throwing error
  }
};




export const rejectSwapRequest = async (req, res) => {
  //travel
  const { requesterTravelId, rejecterTravelId } = req.body;

  try {

    // console.log("I am inside rejectSwapRequest");
    // const travel1 = await Travel.findById(travelId1).populate('user');
    const requesterTravel = await Travel.findById(requesterTravelId).populate('user');
    const rejecterTravel = await Travel.findById(rejecterTravelId).populate('user');

    // const travel2 = await Travel.findById(travelId2).populate('user');
    const requester = requesterTravel.user;
    const rejecter = rejecterTravel.user;


    if (!requester || !rejecter || !requesterTravel || !rejecterTravel) {
      return res.status(404).json({ message: "User or Travel Not Found" });
    }
    const PresentSeat = requesterTravel.passengerInfo;
    const rejecterSeat = rejecterTravel.passengerInfo;
    
    // console.log("present seat ");
    // console.log(PresentSeat);
    
    // Update PresentSeat by removing the _id property
    const updatedPresentSeat = PresentSeat.map(seat => {
        const { _id, ...rest } = seat._doc;
        return rest;
    });
    
    // console.log("updated present seat");
    // console.log(updatedPresentSeat);
    
    // Update WantedSeat by removing the _id property
    const updatedrejecterSeat = rejecterSeat.map(seat => {
        const { _id, ...rest } = seat._doc;
        return rest;
    });
    
    // console.log("updated wanted seat");
    // console.log(updatedWantedSeat);
    // Convert seat objects to strings
const presentSeatString = updatedPresentSeat.map(seat => `Coach: ${seat.currentCoach}, Berth: ${seat.currentBerthNo}`).join('; ');
const wantedSeatString = updatedrejecterSeat.map(seat => `Coach: ${seat.currentCoach}, Berth: ${seat.currentBerthNo}`).join('; ');

    const messageToRequester = `Your request for the seat( ${presentSeatString} ) has been rejected`;
    const messageToRejecter = `You have successfully rejected the request for the swapping your seat with the seat( ${wantedSeatString} )`;

    // const message1 = `You can confirm your swaps. You may communicate with your swapping partners through ${user2.name} (${user2.email}, Please Share your Contact details if you want.`;
    // const message2 = `You can confirm your swaps. You may communicate with your swapping partners through ${user1.name} (${user1.email}, Please Share your Contact details if you want.`;

    // const subject1 = "ConfirmYourSwap";
    // const subject2 = "ConfirmYourSwap";

    const subjectForRequester = "RequestRejected";
    const subjectForRejecter = "SuccessfulRejection";

    const newSwap = new Swap({
      user1: requester,
      user2: rejecter,
      travel1: requesterTravelId,
      travel2: rejecterTravelId
    });

    await newSwap.save();

    await sendNotification_Rejection({
      user1: requester,
      user2: rejecter,
      message1: messageToRequester,
      message2: messageToRejecter,
      subject1: subjectForRequester,
      subject2: subjectForRejecter,
      takeResponse1: false,
      takeResponse2: false,
      travelId1: requesterTravelId,
      travelId2: rejecterTravelId
    });

    return res
      .status(200)
      .json({ message: "Request Rejection Done successfully" });
  } catch (error) {
    console.error("Error rejecting request", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}





export const sendNotification_Confirm = async ({ user1, user2, message1, message2, subject1, subject2, takeResponse1, takeResponse2, travelId1, travelId2 }) => {
  try {
    // console.log(user1);
    // console.log(user2);
    // const user1 = await User.findById(userId1);
    // const user2 = await User.findById(userId2);

    if (!user1 || !user2) {
      // console.error("User Not Found");
      return;
    }

    user1.notifications.push({ message: `${message1}`, subject: `${subject1}`, takeResponse: takeResponse1, ownTravelId: `${travelId1}`, otherTravelId: `${travelId2}` });
    user2.notifications.push({ message: `${message2}`, subject: `${subject2}`, takeResponse: takeResponse2, ownTravelId: `${travelId2}`, otherTravelId: `${travelId1}` });

    await user1.save();
    await user2.save();
    // console.log(user1.email);
    // console.log(user2.email);
    const emailOptions1 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user1.email,
      subject: "ConfirmYourSwap",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <h1>Swap Your Seat</h1>
      <div class="body-section">
      <p>🎉 Congratulations! Your seat swap request has been successfully confirmed by 
          <span style="font-weight: bold; color: green;">${user2.username}</span> 
          (<span style="font-weight: bold; color: red;">${user2.email}</span>).
      </p>
      <hr />
      <p>You can now proceed with your new seat arrangements.</p>
  </div>
  
  <div class="thank-you">
      <p>❤️ Thank you for using our service! ❤️</p>
      <p>Rustam & Sangam</p>
  </div>
  
  </div>
  
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };
    const emailOptions2 = {
      from: {
        name: "Rustam Kumar",
        address: "rustampavri1275@gmail.com",
      },
      to: user2.email,
      subject: "ConfirmYourSwap",
      text: "Swap-simple",
      html: `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .body-section {
            margin-top: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
          }
          .thank-you {
            margin-top: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
      <div class="container">
      <h1>Swap Your Seat</h1>
      <div class="body-section">
      <p>🎉 Congratulations! You have successfully confirmed the seat swap with 
          <span style="font-weight: bold; color: green;">${user1.username}</span> 
          (<span style="font-weight: bold; color: red;">${user1.email}</span>).
      </p>
      <hr />
      <p>You can now proceed with your new seat arrangements.</p>
  </div>
  
  <div class="thank-you">
      <p>❤️ Thank you for using our service! ❤️</p>
      <p>Rustam & Sangam</p>
  </div>
  </div>
  
      </body>
    </html>
     `,
      cc: ["sangamkr.mishra@gmail.com"], // Corrected cc field to be an array
    };

    await sendMail(emailOptions1);
    await sendMail(emailOptions2);


    // console.log("Notifications sent successfully");

    const pushToken1=user1.ExpoToken;
    const pushToken2=user2.ExpoToken;

    if (pushToken1)
      sendExpoNotification(pushToken1, subject1);
    if (pushToken2)
      sendExpoNotification(pushToken2, subject2);
    
  } catch (error) {
    console.error("Error sending Notification", error);
    // Logging and returning instead of throwing error
  }
};



export const confirmSwapSeat = async (req, res) => {
  // console.log("🙌 final swap so let se what happen !!!!!! 🕵️‍♂️🕵️‍♂️🕵️‍♂️🕵️‍♂️🕵️‍♂️")
  const { userId, ownTravelId, otherTravelId } = req.body;
  // console.log(req.body)
  try {
    // console.log("HII1");
    const swap = await Swap.findOne({
      $or: [{ user1: userId, travel1: ownTravelId, travel2: otherTravelId }, { user2: userId, travel1: otherTravelId, travel2: ownTravelId }]
    });
    console.log(swap);
    // console.log("HII2");
    if (!swap) {
      return res.status(404).json({ message: "Swap not found or not confirmed" });
    }
    // console.log("HII3");
    // if(swap.travel1.equals(ownTravelId))
    if (swap.user1.equals(userId)) {
      swap.isConfirmedByUser1 = true;
    }
    if (swap.user2.equals(userId)) {
      swap.isConfirmedByUser2 = true;
    }
    await swap.save();
    // console.log("HII4");
    if (!(swap.isConfirmedByUser1 && swap.isConfirmedByUser2)) {
      // console.log("ytu");
      return res.status(200).json({ message: "Swap not confirmed by both users" });
      // return res.status(400).json({ message: "Swap not confirmed by both users" });
    }
    // console.log("HII5");
    const travel1 = await Travel.findByIdAndDelete(ownTravelId).populate('user');
    console.log(travel1);
    const travel2 = await Travel.findByIdAndDelete(otherTravelId).populate('user');
    console.log(travel2);
    // const travel=await Travel.findById(travelID);
    // if(!travel){
    //     return res.status(505).json({
    //         status:"false",
    //         message:"Travel not Found",
    //     })
    // }
  
    if (!travel1 || !travel2) {
      return res.status(404).json({ message: "Travel documents not found" });

    }
    const rest = await Request.findOne({ travelID: ownTravelId });
    // console.log(rest);
    const resl = await Request.findOneAndDelete({ travelID: ownTravelId });
    const resl2 = await Request.findOneAndDelete({ travelID: otherTravelId });

    // console.log("deleted Success");
    const user1Message = `Your seat (${travel1.seatInfo.coach}-${travel1.seatInfo.berth}) is confirmed with ${travel2.user.username}'s seat (${travel2.seatInfo.coach}-${travel2.seatInfo.berth}).`;
    const user2Message = `Your seat (${travel2.seatInfo.coach}-${travel2.seatInfo.berth}) is confirmed with ${travel1.user.username}'s seat (${travel1.seatInfo.coach}-${travel1.seatInfo.berth}).`;

    const subject1 = "SeatSwapConfirmed";
    const subject2 = "SeatSwapConfirmed";
    await sendNotification_Confirm({
      user1: travel1.user,
      user2: travel2.user,
      message1: user1Message,
      message2: user2Message,
      subject1: subject1,
      subject2: subject2,
      takeResponse1: false,
      takeResponse2: false,
      travelId1: travel1._id,
      travelId2: travel2._id
    });
    // console.log("succed you completed")
    return res.status(200).json({
      message: "Travel schemas deleted successfully and notifications sent",
    });

  } catch (error) {
    console.error("Error confirming swap seat", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
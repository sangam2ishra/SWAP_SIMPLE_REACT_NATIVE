import express from "express";

const router = express.Router();
import PNRController from "../controllers/pnrController.js";

import { applyForSwap } from "../controllers/travelController.js";
import Travel from "../models/travelModel.js";
import User from "../models/userModel.js";
import Request from "../models/requestModel.js";
import { swapRequestNotification, acceptSwapRequest, confirmSwapSeat, getAllNotifications, markNotificationAsSeen, deactivateNotification, rejectSwapRequest, deleteNotification } from "../controllers/notificationController.js";
// Create an instance of PNRController
//sangamkr.mishra
// const apiKey = "faa6bac541mshee4e9bf88a81448p12c76ajsnc853689715d2"; // You can fetch this from environment variables if needed

//ssangamkr.mishra
// const apiKey = "e2ad1e5765msh05ca3bdf74a69b3p1d036bjsn68c272a895fc"; // You can fetch this from environment variables if needed
const apiKey = "bd43179657msh3fadac26017f597p12b3cajsncae99556b6cd"; // You can fetch this from environment variables if needed
// bd43179657msh3fadac26017f597p12b3cajsncae99556b6cd
// bd43179657msh3fadac26017f597p12b3cajsncae99556b6cd
const pnrController = new PNRController(apiKey);

//router.get("/getAllNotifications/:userId", getAllNotifications);
router.get("/getAllNotifications/:userId", getAllNotifications);
router.patch("/markNotificationAsSeen/:userId/:notificationId", markNotificationAsSeen);
router.patch("/deactivateNotification/:userId/:notificationId", deactivateNotification);
router.post("/swapRequestNotification",swapRequestNotification);
router.post("/acceptSwap", acceptSwapRequest);
router.post("/confirmSwap", confirmSwapSeat);
router.post("/rejectSwapRequest", rejectSwapRequest);
router.delete("/deleteNotification", deleteNotification);


router.get("/:pnrNumber", async (req, res) => {
  console.log("GET DETAILS OF PNR ::");
  const { pnrNumber } = req.params;

  const userId = req.query.userId;  // Extract user from URL parameters

  const user = await User.findById(userId);

  try {
    // Fetch PNR Status from API
    const pnrStatus = await pnrController.getPNRStatus(pnrNumber);
    // console.log("Response Data");
    // console.log(pnrStatus);

    // Map passengerList with detailed information
    const passengers = pnrStatus.data.passengerList.map((passenger) => {
      let currentCoach;
      let currentBerthNo;
    
      // Check if booking status is CNF
      if (passenger.bookingStatus === "CNF") {
        currentCoach = passenger.bookingCoachId;
        currentBerthNo = passenger.bookingBerthNo;
      } 
      // If booking status is not CNF, check current status
      else if (passenger.currentStatus === "CNF") {
        currentCoach = passenger.currentCoachId;
        currentBerthNo = passenger.currentBerthNo;
      } 
      // If neither booking nor current status is CNF, use default values
      else {
        currentCoach = passenger.currentStatus;
        currentBerthNo = passenger.currentBerthNo;  // Assuming currentBerthNo remains the same
      }
    
      return {
        // Assigning the calculated currentCoach and currentBerthNo
        currentCoach: currentCoach,
        currentBerthNo: currentBerthNo,
      };
    });
    
     // Convert date from "Nov 27, 2024" to "04-10-2024" format
     const journeyDate = new Date(pnrStatus.data.dateOfJourney);
     const formattedDate = journeyDate.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Create travel model as per new data
    const travel = new Travel({
      pnrNo: pnrNumber,
      user: user,
      boardingInfo: {
        trainId: pnrStatus.data.trainNumber,  // Updated field
        stationName: pnrStatus.data.boardingPoint,  // Updated field
      },
      destinationInfo: {
        stationName: pnrStatus.data.destinationStation,  // Updated field
      },
      seatInfo: {
        noOfSeats: pnrStatus.data.numberOfpassenger,  // Updated field
      },
      trainInfo: {
        trainNo: pnrStatus.data.trainNumber,  // Updated field
        name: pnrStatus.data.trainName,  // Updated field
        boarding: pnrStatus.data.boardingPoint,  // Updated field
        destination: pnrStatus.data.destinationStation,  // Updated field
        dt: formattedDate,  // Updated field
      },
      passengerInfo: passengers,  // Updated passenger info mapping
    });

    let data = await travel.save();
    // console.log("hi i am data", data);

    res.status(201).json({ success: true, message: "Successful", travel });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/:pnrNumber/swap-seat", async (req, res,next) => {
  // console.log("Received swap request:");
  // console.log(req.body);
  // console.log(req.body.selectedCoaches);
  const { pnrNumber } = req.params;

  // console.log(pnrNumber);

  const pnrdata = parseInt(pnrNumber, 10);

  // console.log("PNR DATA ", pnrdata);

  // console.log(req.body);

  const selectedCoaches = req.body.selectedCoaches || "{}";
  // console.log("final", selectedCoaches);

  // Convert selectedCoaches object to array format
  const selectedCoachesArray = Object.keys(selectedCoaches).map((coach) => {
    const coachObject = {};
    coachObject[coach] = selectedCoaches[coach];
    return coachObject;
  });

  
  // console.log("final-2", selectedCoachesArray);
  try {
    
    // Step 1: Find the travel model based on the PNR number
    let travelModel = await Travel.findOne({ pnrNo: pnrdata });

    if (!travelModel) {
      return res
        .status(404)
        .json({ success: false, message: "Travel model not found" });
    }
     
    const preferenceList = req.body.preferenceList; // Assuming preferenceList is provided in the request body
    travelModel.preferences = preferenceList; // Assign the preference list to travelModel
    await travelModel.save(); // Save the updated travel model
    // console.log("Updated Prefernce");
    // console.log(travelModel);
    // saving the request 
    //  const request=await findOne({trainID:travelModel._id});
    //   request.preferences=preferenceList;
    //   await request.save();
    //   console.log("Lo ho gaya update prefernces");
    //   console.log(request);
    // const request=new Request({
    //    name:req.body.name,
    //    trainID:travelModel.trainInfo.name,
    //    boardingStation:travelModel.boardingInfo.stationName,
    //    destinationStation:travelModel.destinationInfo.stationName,
    //    dt:travelModel.trainInfo.dt,
    //    isSwap:false,
    //    preferences:preferenceList,
    // })
   
    // try{
    //    await request.save();
    //    console.log("Request Model update ");
    //    console.log(request);
    //  }
    //  catch(error){
    //   next(error);
    //  }

    // Step 2: Extract train number and date from the travel model
    const { trainNo, dt } = travelModel.trainInfo;

    // all travel 
    const allTravels = await Travel.find({
      "trainInfo.trainNo": trainNo,
      "trainInfo.dt": dt,
      pnrNo: { $ne: pnrdata } // Exclude the travel with the provided PNR number
    });
    // Step 4: Apply the final filter based on selected coach and seat numbers
    const selectedCoachesArray = Object.keys(selectedCoaches).map((coach) => {
      const coachObject = {};
      coachObject[coach] = selectedCoaches[coach];
      return coachObject;
    });

    // Filter travels for partially swap (without additional condition)
    const partiallyFilteredTravels = allTravels.filter((travel) => {
      for (const coachObject of selectedCoachesArray) {
        const coach = Object.keys(coachObject)[0];
        const seats = coachObject[coach].map((seat) =>
          String(parseInt(seat, 10))
        );

        const passengers = travel.passengerInfo.filter((passenger) => {
          return (
            passenger.currentCoach === coach &&
            seats.includes(passenger.currentBerthNo)
          );
        });

        if (passengers.length > 0) {
          return true;
        }
      }
      return false;
    });

    // Filter travels for perfect swap (with additional condition)
    const perfectFilteredTravels = partiallyFilteredTravels.filter((travel) => {
      return (
        travel.boardingInfo.stationName === travelModel.boardingInfo.stationName &&
        travel.destinationInfo.stationName === travelModel.destinationInfo.stationName
      );
    });

    // if (perfectFilteredTravels.length === 0) {
    //   return res
    //     .status(404)
    //     .json({
    //       success: false,
    //       message: "No perfect swapping matches found",
    //       travels: [],
    //     });
    // }

  //   // Update preferences in the found travel model
  //  console.log("PArtially");
  //  console.log(partiallyFilteredTravels);
  //  console.log("Perferct conditon");
  //  console.log(perfectFilteredTravels);


    res
      .status(200)
      .json({
        success: true,
        message: "Travel model updated successfully",
        partiallySwaps: partiallyFilteredTravels,
        perfectSwaps: perfectFilteredTravels,
      });
  } catch (error) {
    console.error("Error processing swap request:", error);
    res
      .status(500)
      .json({ success: false, message: "Error processing swap request" });
  }
});
//For sending notifications
// router.post("/send-notification",sendNotification);


export default router;

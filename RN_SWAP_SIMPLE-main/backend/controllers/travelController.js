import mongoose from "mongoose";

import Travel from "../models/travelModel.js";
import PNRController from "./pnrController.js";
// const PNRController = require("./pnrController");
import User from "../models/userModel.js";
// const User = require("../../models/userModel");

export const applyForSwap = async (req, res) => {
  try {
    // Validate input data
    if (!req.body.pnrNo) {
      return res
        .status(400)
        .json({ success: false, message: "PNR number is required" });
    }

    // Instantiate PNRController with your API key
    const pnrController = new PNRController(
      "faa6bac541mshee4e9bf88a81448p12c76ajsnc853689715d2"
    ); // Replace 'your_api_key_here' with your actual API key

    // Get PNR details from the API
    const pnrDetails = await pnrController.getPNRStatus(req.body.pnrNo);

    if (!pnrDetails) {
      throw new Error("Error in getting PNR details from API");
    }

    // Create a new travel document with the extracted PNR details and preferences
    const travel = new Travel({
      user: req.user.id, // Assuming user ID is attached by authMiddleware
      boardingInfo: pnrDetails.boardingInfo,
      destinationInfo: pnrDetails.destinationInfo,
      seatInfo: pnrDetails.seatInfo,
      trainInfo: pnrDetails.trainInfo,
      passengerInfo: pnrDetails.passengerInfo,
      preferences: req.body.preferences || [], // Use empty array if preferences are not provided
    });

    // Save the travel document
    await travel.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Seat swap request applied successfully",
    });
  } catch (error) {
    console.error("Error applying for seat swap:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllTravels = async (req, res) => {
  try {
    // Fetch all travel documents from the database
    const travels = await Travel.find();

    // Send the list of travels as a response
    res.status(200).json({ success: true, data: travels });
  } catch (error) {
    console.error("Error fetching travels:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getSpecificTravels = async (req, res) => {
  try {
    // Extract user ID from the request object
    const userId = req.userId;

    // Find all travels associated with the user
    const userTravels = await Travel.find({ user: userId });
    if (!userTravels) {
      return res
        .status(404)
        .json({ success: false, message: "Travels not found for this user" });
    }

    // Extract PNR numbers from the user's travels
    const pnrNumbers = userTravels.map((travel) => travel.pnrNo);

    // Fetch details from the API for each PNR number
    const pnrDetailsArray = [];
    for (const pnrNumber of pnrNumbers) {
      const pnrDetails = await PNRController.getPNRStatus(pnrNumber);
      pnrDetailsArray.push(pnrDetails);
    }

    // Extract train IDs and dates from the API responses
    const trainIdsAndDates = pnrDetailsArray.map((pnrDetails) => ({
      trainId: pnrDetails.trainId,
      date: pnrDetails.dt,
    }));

    // Find all travels related to the extracted train IDs and dates
    const relatedTravels = [];
    for (const { trainId, date } of trainIdsAndDates) {
      const travels = await Travel.find({
        "trainInfo.trainNo": trainId,
        "trainInfo.dt": date,
      });
      relatedTravels.push(...travels);
    }

    // Send the list of related travels as a response
    res.status(200).json({ success: true, data: relatedTravels });
  } catch (error) {
    console.error("Error fetching specific travels:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const getPreferredTravels = async (req, res) => {
  try {
    // Extract user ID from the request object
    const userId = req.userId;

    // Find the current travel associated with the user
    const currentTravel = await Travel.findOne({ user: userId });
    if (!currentTravel) {
      return res
        .status(404)
        .json({ success: false, message: "Travel not found for this user" });
    }

    // Extract trainId and date from the current travel
    const { trainId, date } = currentTravel.trainInfo;

    // Find travels with the same trainId and date
    const relatedTravels = await Travel.find({
      "trainInfo.trainId": trainId,
      "trainInfo.dt": date,
    });

    // Extract preferences from the current travel
    const { preferences } = currentTravel;

    // Filter travels based on matching preferences
    const preferredTravels = relatedTravels.filter((travel) =>
      preferences.some((preference) =>
        travel.passengerInfo.some(
          (passenger) =>
            passenger.currentCoach === preference.coach &&
            passenger.currentBerthNo === preference.seatNo
        )
      )
    );

    // Send the list of preferred travels as a response
    res.status(200).json({ success: true, data: preferredTravels });
  } catch (error) {
    console.error("Error fetching preferred travels:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



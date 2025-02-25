import Request from "../models/requestModel.js";
import Travel from "../models/travelModel.js";
import User from "../models/userModel.js";
import { errorHandler } from "../utilis/error.js";

export const getAll_Req = async (req, res, next) => {
    console.log("RK________999999");
    try {
      console.log("Pavri");
      //console.log(req);
      const requests = await Request.find().select('-pnrNo').populate({
        path: 'user',
        select: 'username' // Only include the username field from the user document
      });

    //  console.log(requests);
    if(requests.length===0){
        console.log("hii");
      return  res.status(200).json({
            status: "202",
            success:"false",
            requests: requests
          });
    }
    console.log(requests);
      res.status(200).json({
        status: true,
        requests: requests
      });
      
    } catch (error) {
     // console.error("Error fetching requests:", error);
      console.error("Error fetching requests:");

      res.status(500).json({
        status: false,
        message: "Error fetching requests"
      });
    }
  }

export const addRequest=async(req,res,next)=>{
    const {userId}=req.params;
    const {travelId}=req.params;
    console.log("ADD ons ");
    console.log(travelId);
    const user=await User.findById(userId);
    if(!user){
        return next(errorHandler('404',"User Not Found"));
    }
    const travel=await Travel.findById(travelId);
    console.log("travel Model");
    console.log(travel);
    if(!travel){
        return res.status(505).json({
            status:"false",
            message:"Travel not Found",
        })
    }
   
    console.log("ADDING REQUEST ---------------");
     //   console.log(travel);
    // const check=await Request.findOne({pnrNo:travel.pnrNo});
    // // uniqueness of pnr 
    // if(check){
    //     console.log("duplicates");
    //     return res.status(202).json({
    //         status:"202",
    //         success:"false",
    //         message:"You are Not permitted for multiple request for Single Pnr No",
    //     })
    // }

    const request=new Request({
        user:user,
        pnrNo:travel.pnrNo,
        trainNo:travel.trainInfo.trainNo,
        travelID:travel._id,
        trainID:travel.trainInfo.name,
        boardingStation:travel.boardingInfo.stationName,
        destinationStation:travel.destinationInfo.stationName,
        dt:travel.trainInfo.dt,
        isSwap:false,
        preferences:travel.preferences,
     })
    
     try{
        await request.save();
        console.log("Request Model update ");
        console.log(request);
        return res.status(201).json({
            success:"true",
            message:"successfull",
        })
      }
      catch(error){
       next(error);
      }
}  

export const  deleteReq=async(req,res,next)=>{
    console.log("Hi deletion section");
    const {userId}=req.params;
    const {travelID}=req.params;
    //  travelID
        // "66446ed8bca05e71101bd5ce"
    console.log(travelID);
    const user=await User.findById(userId);
    if(!user){
        return res.status(505).json({
            status:"false",
            message:"User not Found",
        })
    }
    
    const travel=await Travel.findById(travelID);
    if(!travel){
        return res.status(505).json({
            status:"false",
            message:"Travel not Found",
        })
    }
    const rest=await Request.findOne({travelID:travelID});
   console.log(rest);
    const resl=await Request.findOneAndDelete({travelID:travelID});
   
    console.log("deleted Success");
   // console.log(resl);

    res.status(202).json({                 
       
        success:"true",
        message:"Succefull deletion",

    })

}
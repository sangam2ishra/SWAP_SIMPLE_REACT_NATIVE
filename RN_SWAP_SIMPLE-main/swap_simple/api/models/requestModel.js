import mongoose from "mongoose";
const requestSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        // required:true
    },
    pnrNo:{
        type:String,
        required:true,
    },
    trainNo:{
        type:String,
        required:true,
    },
    travelID:{
        type:String,
        required:true
    },
    trainID:{
        type:String,
        required:true
    },
    boardingStation:{
        type:String,
        required:true
    },
    destinationStation:{
        type:String,
        required:true
    },
    dt: {
        type: String,
        required: true
    },
    isSwap:
    {
      type:Boolean,
      required:true,
    },
    preferences: [{
        coach: {
            type: String,
            required: true
        },
        seatNo: {
            type: String,
            required: true
        }
    }]
},
{
    timestamps: true
});


const Request=mongoose.model('Request', requestSchema);
export default Request;
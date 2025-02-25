import mongoose from "mongoose";

const travelSchema = new mongoose.Schema(
    {
        pnrNo:{
            type: String,
            required: [true, "PNR number is required"]
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            // required:true
        },
        boardingInfo: {
            trainId: {
                type: Number,
                required: true
            },
            stationId: {
                type: Number,
                required: false // Changed to false
            },
            arrivalTime: {
                type: String,
                required: false // Changed to false
            },
            departureTime: {
                type: String,
                required: false // Changed to false
            },
            haltTime: {
                type: String,
                required: false // Changed to false
            },
            stationCode: {
                type: String,
                required: false // Changed to false
            },
            stationName: {
                type: String,
                required: false // Changed to false
            },
            travellingDay: {
                type: Number,
                required: false // Changed to false
            },
            distance: {
                type: String,
                required: false // Changed to false
            },
            platform: {
                type: String,
                required: false // Changed to false
            }
        },
        destinationInfo: {
            trainId: {
                type: Number,
                required: false // Changed to false
            },
            stationId: {
                type: Number,
                required: false // Changed to false
            },
            arrivalTime: {
                type: String,
                required: false // Changed to false
            },
            departureTime: {
                type: String,
                required: false // Changed to false
            },
            haltTime: {
                type: String,
                required: false // Changed to false
            },
            stationCode: {
                type: String,
                required: false // Changed to false
            },
            stationName: {
                type: String,
                required: false // Changed to false
            },
            travellingDay: {
                type: Number,
                required: false // Changed to false
            },
            distance: {
                type: String,
                required: false // Changed to false
            },
            platform: {
                type: String,
                required: false // Changed to false
            }
        },
        seatInfo: {
            coach: {
                type: String,
                required: false
            },
            berth: {
                type: String,
                required: false
            },
            noOfSeats: {
                type: Number,
                required: false
            }
        },
        trainInfo: {
            trainNo: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            boarding: {
                type: String,
                required: true
            },
            destination: {
                type: String,
                required: true
            },
            dt: {
                type: String,
                required: true
            },
            boardingDayCount: {
                type: Number,
                required: false
            },
            fromStationName: {
                type: String,
                required: false
            },
            toStationName: {
                type: String,
                required: false
            },
            origin: {
                type: String,
                required: false
            }
        },
        passengerInfo: [
            {
                currentCoach: {
                    type: String,
                    required: true
                },
                currentBerthNo: {
                    type: String,
                    required: true
                }
            }
        ],
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
    }
);


const Travel=mongoose.model('Travel', travelSchema);
export default Travel;

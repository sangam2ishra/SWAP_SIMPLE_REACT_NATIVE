import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // required:true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  ExpoToken:{
    type: String, 
    default: null
  },
  notifications: [
    {
      message: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        default: "Notification"
        // required: true,
      },
      takeResponse: {
        type: Boolean,
        default: false
      },
      active: {
        type: Boolean,
        default: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      seen: {
        type: Boolean,
        default: false,
      },
      ownTravelId: {
        type: String
      },
      otherTravelId: {
        type: String
      }
    },
  ],
}, { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;

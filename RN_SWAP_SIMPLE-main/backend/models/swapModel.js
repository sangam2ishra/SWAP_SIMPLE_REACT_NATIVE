import mongoose from "mongoose";

const swapSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travel1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  travel2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Travel',
    required: true
  },
  isConfirmedByUser1: {
    type: Boolean,
    default: false
  },
  isConfirmedByUser2: {
    type: Boolean,
    default: false
  },
  overallConfirm: {
    type: Boolean,
    default: function() {
      return this.isConfirmedByUser1 && this.isConfirmedByUser2;
    }
  }
},{
  timestamps: true
});

const Swap = mongoose.model('Swap', swapSchema);

export default Swap;

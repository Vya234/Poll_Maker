// models/Poll.js
const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  pollType: {
    type: String,
    enum: ['Multiple Choice', 'Single Choice'],
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      votes: {
        type: Number,
        default: 0,
      },
      voters: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // Null if the voter is anonymous
          },
          name: {
            type: String,
            default: null, // Name of the voter if requireNames is true
          },
        },
      ],
    },
  ],
  settings: {
    allowMultiple: {
      type: Boolean,
      default: false,
    },
    requireNames: {
      type: Boolean,
      default: false,
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Poll', pollSchema);

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  deadline: {
    type: Date,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
},  { timestamps: true, versionKey: false });

module.exports = mongoose.model('Note', noteSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema
const videoSchema = mongoose.Schema({
  
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title : {
    type: String,
    maxlength: 50
  },
  description : {
    type: String,
  },
  filePath: {
    type: String,
  },
  Category: {
    type: String,
  },
  privacy: {
    type: Number,
  },
  views: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
  },
  tumbnail: {
    type: String,
  }

}, { timestamps: true })

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }
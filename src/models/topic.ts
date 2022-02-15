import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';
const TopicOfInterestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  recommendation: {
    type: Boolean,
    required: true,
  },
});

TopicOfInterestSchema.pre('save', function (next) {
  if(!this?.topicId) {
    this.topicId = uuidv4();
  }
  next();
})

const Topic = mongoose.model("topic", TopicOfInterestSchema, 'Topics');

export default Topic;


// RoadMap.js
import mongoose, { Schema } from 'mongoose';

const weekSchema = new Schema({
  week: Number,
  topics: [String],
});

const roadmapSchema = new Schema(
  {
    goal: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    weeks: [weekSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
  }
);

const RoadMap = mongoose.model('RoadMap', roadmapSchema);
export default RoadMap;
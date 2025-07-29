
// import mongoose, { Schema } from 'mongoose';

// const weekSchema = new Schema({
//   week: Number,
//   topics: [String],
// });

// const roadmapSchema = new Schema(
//   {
//     goal: String,
//     level: {
//       type: String,
//       enum: ['beginner', 'intermediate', 'advanced'],
//     },
//     weeks: [weekSchema],
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   },
//   {
//     timestamps: true,
//   }
// );

// const RoadMap = mongoose.model('RoadMap', roadmapSchema);
// export default RoadMap;






import mongoose from 'mongoose';

  const roadmapSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      topic: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
      },
      content: {
        type: Object,
        default: {},
      },
    },
    { timestamps: true }
  );

  export default mongoose.model('Roadmap', roadmapSchema);
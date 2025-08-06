// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     bio: {
//       type: String,
//       default: "",
//     },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//     backgroundPic: {
//       type: String,
//       default: "",
//     },
//     nativeLanguage: {
//       type: String,
//       default: "",
//     },

//     location: {
//       type: String,
//       default: "",
//     },
//     dateOfBirth: {
//       type: Date,
//       default: ""
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     skills: {
//       type: [String],

//       default: []
//     },
//     faces: [{
//       descriptor: [Number],
//       cloudinaryUrl: String,
//       publicId: String
//     }],
//     isOnboarded: {
//       type: Boolean,
//       default: false,
//     },
//     friends: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//       otp: String,
//   otpExpiresAt: Date,
//   },

//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
//   return isPasswordCorrect;
// };

// const User = mongoose.model("User", userSchema);

// export default User;

// import mongoose from "mongoose";
//   import bcrypt from "bcryptjs";

//   const userSchema = new mongoose.Schema(
//     {
//       fullName: {
//         type: String,
//         required: true,
//       },
//       email: {
//         type: String,
//         required: true,
//         unique: true,
//       },
//       password: {
//         type: String,
//         required: true,
//         minlength: 6,
//       },
//       bio: {
//         type: String,
//         default: "",
//       },
//       profilePic: {
//         type: String,
//         default: "",
//       },
//       backgroundPic: {
//         type: String,
//         default: "",
//       },
//       nativeLanguage: {
//         type: String,
//         default: "",
//       },
//       location: {
//         type: String,
//         default: "",
//       },
//       dateOfBirth: {
//         type: Date,
//         default: ""
//       },
//       phone: {
//         type: String,
//         required: false,
//         // required: true,
//         unique: true
//       },
//       skills: {
//         type: [String],
//         default: []
//       },
//       faces: [{
//         descriptor: [Number],
//         cloudinaryUrl: String,
//         publicId: String
//       }],
//       isOnboarded: {
//         type: Boolean,
//         default: false,
//       },
//       friends: [
//         {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//       ],
//       otp: String,
//       otpExpiresAt: Date,
//     },
//     { timestamps: true }
//   );

//   userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();

//     try {
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });

//   userSchema.methods.matchPassword = async function (enteredPassword) {
//     const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
//     return isPasswordCorrect;
//   };

//   const User = mongoose.model("User", userSchema);

//   export default User;

// admin

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: Date,
    },
    age: {
      type: Number,
    },
    education: {
      type: String,
      default: "",
    },
    profileImage: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // ✅ Role field added for user/admin
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// addd

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
//   return isPasswordCorrect;
// };
// end

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
  {
    fullName: {
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
    profilePic: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
     faces: [
      {
        descriptor: [Number],
        cloudinaryUrl: String,
        publicId: String,
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    skills: [{
      type: String,
      default: ""
    }],
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },

  },
  {
    timestamps: true,
  }
);



userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  const isPasswordCorrect = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordCorrect;
};


const User = mongoose.model("User", userSchema);

export default User;


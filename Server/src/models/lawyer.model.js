// import mongoose from "mongoose";

// const lawyerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   specialization: { type: String, required: true },
//   location: { type: String },
//   experience: { type: Number }, // optional
// });

// const Lawyer = mongoose.model("Lawyer", lawyerSchema);

// export default Lawyer;


import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  password: { type: String, required: true },
  cpassword: { type: String, required: true },
  cnic: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  experience: { type: String, required: true },
  qualification: { type: String, required: true },
  expertise: { type: String, required: true },
  refreshToken: { type: String },
  image: { type: String, required: true },
  lawyerID: { type: String, required: true, unique: true }
});

// Password hashing before save
lawyerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.cpassword = await bcrypt.hash(this.cpassword, 12);
  next();
});

// JWT methods
lawyerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

lawyerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Model creation
const Lawyer = mongoose.models.Lawyer || mongoose.model('Lawyer', lawyerSchema, 'lawyers');

export { Lawyer };
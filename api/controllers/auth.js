import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";
const saltRounds = 10;

export const signup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();
    res.status(200).json("User has been created");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const user = await User.findOne({ name: req.body.name });
  // If user is not found in the database
  console.log("user sent");
  if (!user) return next(createError(404, "User Not Found in the Database"));

  // Checking correct password
  const isCorrect = await bcrypt.compare(req.body.password, user.password);
  if (!isCorrect) return next(createError(404, "Wrong Credentials"));

  // It's gonna create a hashed token based on this id
  const token = jwt.sign({ id: user._id }, process.env.JWT);

  // Using cookies to send the token to the user
  // http only will make our cookie secure and not allow third party apps to use it.

  const { password, ...others } = user._doc;
  res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json(others);
};

// Google auth
export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("Access Token", token, { httpOnly: true })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({ ...req.body, fromGoogle: true });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("Access Token", token, { httpOnly: true })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
    next(err);
  }
};

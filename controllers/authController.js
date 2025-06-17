const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const sendVerificationEmail = require("../helper/sendVerificationEmail");
const errorHandler = require("../helper/errorHandler");
const User = require("../models/userModel");

exports.postLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) errorHandler(401, "Wrong user credentials entered.");

    const isPasswordMatch = bcrypt.compareSync(password, user.password.trim());
    if (!isPasswordMatch) errorHandler(401, "Wrong user credentials entered.");

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      isSuccess: true,
      message: "User logged in successfully.",
      token,
    });
  } catch (error) {
    throw error;
  }
};

exports.postRegister = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) errorHandler(422, "Email is already in use.");

    const hashedPassword = bcrypt.hashSync(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    sendVerificationEmail(email, verifyToken)
      .then(() => {
        console.log(`Sent email to ${email}!`);
      })
      .catch((err) => console.log(err));

    res.status(200).json({
      isSuccess: true,
      message:
        "User successfully registered. Please verify email before logging in.",
    });
  } catch (error) {
    throw error;
  }
};

exports.getVerifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(401, "Validation failed.", errors.array());

    const { token } = req.query;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) errorHandler(401, "Invalid token.");

    const user = await User.findOne({ email: decodedToken.email });

    if (!user.isVerified) {
      res.json({
        isSuccess: true,
        message: "This user is not verified.",
        isVerified: user.isVerified,
      });
      return;
    }

    res.json({
      isSuccess: true,
      message: "This user is verified.",
      isVerified: user.isVerified,
    });
  } catch (error) {
    throw error;
  }
};

exports.patchVerifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { token } = req.query;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) errorHandler(401, "Invalid token.");

    const user = await User.findOneAndUpdate(
      { email: decodedToken.email },
      { isVerified: true },
      { new: true, runValidators: true }
    );

    res.json({
      isSuccess: true,
      message: "Successfully updated the user to verified. Try to login again.",
      isVerified: user.isVerified,
    });
  } catch (error) {
    throw error;
  }
};

exports.postResendEmail = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      errorHandler(422, "Validation failed.", errors.array());

    const { token } = req.query;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedToken) errorHandler(401, "Invalid token.");

    const newToken = jwt.sign(
      { email: decodedToken.email },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    sendVerificationEmail(decodedToken.email, newToken)
      .then(() => {
        console.log(`Sent email to ${decodedToken.email}!`);
      })
      .catch((err) => console.log(err));

    res.json({
      isSuccess: true,
      message: "Successfully resent email verification link.",
    });
  } catch (error) {
    throw error;
  }
};

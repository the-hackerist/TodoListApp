const express = require("express");
const { body, query } = require("express-validator");

const {
  postLogin,
  postRegister,
  getVerifyEmail,
  patchVerifyEmail,
  postResendEmail,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format.")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  postLogin
);

router.post(
  "/register",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required.")
      .isEmail()
      .withMessage("Invalid email format.")
      .normalizeEmail(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one digit.")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must contain at least one special character."),
  ],
  postRegister
);

router.get(
  "/verify",
  [
    query("token")
      .trim()
      .isJWT()
      .notEmpty()
      .withMessage("A token is required."),
  ],
  getVerifyEmail
);

router.patch(
  "/verify",
  [
    query("token")
      .trim()
      .isJWT()
      .notEmpty()
      .withMessage("A token is required."),
  ],
  patchVerifyEmail
);

router.post(
  "/verify",
  [
    query("token")
      .trim()
      .isJWT()
      .notEmpty()
      .withMessage("A token is required."),
  ],
  postResendEmail
);

module.exports = router;

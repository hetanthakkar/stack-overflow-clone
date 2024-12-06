// import { Router } from "express";
// import { registerMail } from "../controller/mailer.js";
// import Auth, { OTPLocalVariables } from "../middleware/auth.js";

const express = require("express");
const router = express.Router();
const { getUserActivityLog } = require("../controller/activityLog.js");

const { Auth } = require("../middleware/auth.js");

// This is the code where we import all our controllers from the appController.js
// import * as controller from "../controller/appController.js";
const controller = require("../controller/appController.js");

/**
 * POST
 */
router.route("/register").post(controller.register);
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); //authenticate the user
router.route("/login").post(controller.verifyUser, controller.login); //login into the app
router.route("/logout").post(controller.verifyUser, controller.logout); //login into the app
// router.route("/getUsers").post(controller.getUsers); //login into the app
router.route("/getUsers").post(controller.getUsers); //authenticate the user
// router.route("/answers").put(controller); //login into the app

/**
 * GET
 */
router
  .route("/user/:username")
  .get(controller.validateBearerToken, controller.getUser); //username with the user

router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); //verify the OTP
router.route("/users/:userId/activity").get(getUserActivityLog);

/**
 * PUT
 */
router.route("/updateUser").put(Auth, controller.updateUser); //used to update the user profile

module.exports = router;

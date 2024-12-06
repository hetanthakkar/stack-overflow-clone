// auth.js

const jwt = require("jsonwebtoken");
const ENV = require("../config.js");

/**
 * This is my authentication middleware
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function Auth(req, res, next) {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication Failed" });
    }
    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    const decodedToken = await jwt.verify(token, "Hetan");

    // Set the decoded user information in the request object
    req.user = decodedToken;

    // Proceed to the next middleware
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication FailedD" });
  }
}

function OTPLocalVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}

module.exports = { Auth, OTPLocalVariables };

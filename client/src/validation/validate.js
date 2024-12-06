import toast from "react-hot-toast";
import { authenticate } from "./helper";

export async function usernameValidate(errors, values) {
  if (values.username) {
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error("User does not Exist...!");
    } else {
      toast.success("Logged in");
    }
  } else {
    if (!values.username) {
      errors.username = toast.error("Please enter username.");
    } else if (values.username.includes(" ")) {
      errors.username = toast.error("Username cannot contain spaces.");
    }
  }
}

export async function passwordValidate(errors, values) {
  if (!values.password) {
    errors.password = toast.error("Please enter password.");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Password cannot contain spaces.");
  }
}

export async function resetPasswordValidation(values) {
  const errors = {};

  if (!values.password) {
    errors.password = toast.error("Please enter password.");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Password cannot contain spaces.");
  }

  if (!values.confirm_password) {
    errors.confirm_password = toast.error("Please confirm password.");
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = toast.error("Passwords don't match.");
  }
  return errors;
}

export async function registerValidate(values) {
  const errors = {};
  usernameValidate(errors, values);
  passwordValidate(errors, values);
  verifyEmail(errors, values);

  return errors;
}

function verifyEmail(error = {}, values) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[a-zA-Z]{2,}$/;
  if (!values.email) {
    error.email = toast.error("Email Cannot be Blank...!");
  } else if (values.email.includes(" ")) {
    error.email("Email Address cannot have spaces...!");
  } else if (!emailRegex.test(values.email)) {
    error.email = toast.error("Invalid Email Address...!");
  }

  return error;
}

/**
 *
 * Here, I have defined the logic for Profile Validation
 */

export async function profileValidate(values) {
  const errors = verifyEmail({}, values);
  return errors;
}

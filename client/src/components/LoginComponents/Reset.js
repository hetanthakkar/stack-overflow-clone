import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { resetPasswordValidation } from "../../validation/validate";
import "../../Login-Stylesheet/Username.css";
export default function Reset() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      // User is present in localStorage, so redirect to /home
      navigate("/");
    }
  });
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validate: resetPasswordValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formik.values.password && !formik.values.confirm_password) {
      return toast.error("Please Complete all the Fields");
    }
    if (!formik.values.password) {
      return toast.error("Please enter your Password...!");
    }
    if (!formik.values.confirm_password) {
      return toast.error("Enter your Password Again to Verify...!");
    }
    formik.handleSubmit();
  };
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className="glass">
          <div className="title flex flex-col items-center">
            <h3 className="pt-5 text-5xl font-bold">Reset</h3>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter Your New Password!
            </span>
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="main_working_box">
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Please Enter your New Password"
                className="textbox"
              />
              <input
                {...formik.getFieldProps("confirm_password")}
                type="password"
                placeholder="Please Enter Again to Verify"
                className="textbox"
              />
              <button type="Submit" className="btn">
                Reset
              </button>
            </div>
            <div className="text-center py-4 pb-5">
              <Link className="text-red-500" to="/">
                Back To Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

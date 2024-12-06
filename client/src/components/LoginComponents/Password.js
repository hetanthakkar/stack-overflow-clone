import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../public/profile.png";
import "../../Login-Stylesheet/Username.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../../validation/validate";

export default function Password() {
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
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className="glass">
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">LOG IN</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Please Login with your Credentials.
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img src={avatar} className="profile_img" alt="avatar" />
            </div>
            <div className="main_working_box">
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Username"
                className="textbox"
              />
              <input
                {...formik.getFieldProps("password")}
                type="text"
                placeholder="Password"
                className="textbox"
              />
              <button type="Submit" className="btn">
                {" "}
                Login
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                First Time User{" "}
                <Link className="text-red-500" to="/register">
                  Register Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

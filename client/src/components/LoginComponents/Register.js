import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../../public/profile.png";
import "../../Login-Stylesheet/Username.css";
import { Toaster, toast } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidate } from "../../validation/validate";
import saveFile from "../../validation/imageSave";
import { registerUser } from "../../validation/helper";

export default function Register() {
  const navigate = useNavigate();

  const [file, setFile] = useState();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: registerValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || " " });
      console.log(values);
      navigate("/");
    },
  });

  const uploadFile = async (e) => {
    const image = await saveFile(e.target.files[0]);
    setFile(image);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (
      !formik.values.username &&
      !formik.values.password &&
      !formik.values.email
    ) {
      return toast.error("Please enter email, username, and password.");
    }
    if (!formik.values.email && !formik.values.username) {
      return toast.error("Please enter Email and Username...!");
    }
    if (!formik.values.username && !formik.values.password) {
      return toast.error("Please enter Username and Password...!");
    }
    if (!formik.values.email && !formik.values.password) {
      return toast.error("Please enter Email and Password...!");
    }

    if (!formik.values.email) {
      return toast.error("Please Enter Email");
    }
    if (!formik.values.username) {
      return toast.error("Please enter username.");
    }
    if (!formik.values.password) {
      return toast.error("Please entejr password.");
    }

    try {
      const credentials = {
        username: formik.values.username,
        password: formik.values.password,
        email: formik.values.email,
        profile: file || "", // Include the profile image if available
      };

      const msg = await registerUser(credentials);
      toast.success(msg);

      setTimeout(() => {
        formik.handleSubmit();
      }, 500);
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Failed to register user. Please try again.");
    }
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className="glass reg_width">
          <div className="title flex flex-col items-center">
            <h4 className="pt-3 text-5xl font-bold">Let's Register...!</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Please Fill In Your Details...!
            </span>
          </div>
          <form className="py-1" onSubmit={handleFormSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className="profile_img"
                  alt="avatar"
                />
              </label>
              <input
                onChange={uploadFile}
                type="file"
                id="profile"
                name="profile"
              />
            </div>
            <div className="main_working_box">
              <input
                {...formik.getFieldProps("email")}
                type="text"
                placeholder="Email"
                className="textbox"
              />
              <input
                {...formik.getFieldProps("username")}
                type="text"
                placeholder="Username"
                className="textbox"
              />
              <input
                {...formik.getFieldProps("password")}
                type="password"
                placeholder="Password"
                className="textbox"
              />
              <button type="submit" className="btn">
                Register
              </button>
            </div>
            <div className="text-center py-2">
              <span className="text-gray-500">
                {" "}
                Already Registered?{" "}
                <Link className="text-red-500" to="/">
                  {" "}
                  Login{" "}
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

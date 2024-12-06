import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../../public/profile.png";
import "../../Login-Stylesheet/Username.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { profileValidate } from "../../validation/validate";
import saveFile from "../../validation/imageSave";

export default function Profile() {
  const [file, setFile] = useState();
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      mobile: "",
      email: "",
      address: "",
    },
    validate: profileValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || " " });
      console.log(values);
    },
  });

  const uploadFile = async (e) => {
    const image = await saveFile(e.target.files[0]);
    setFile(image);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className="glass reg_width">
          <div className="title flex flex-col items-center">
            <h4 className="pt-3 text-5xl font-bold">Profile</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Update your Profile...!
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
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
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("firstname")}
                  type="text"
                  placeholder="First Name"
                  className="textbox"
                />
                <input
                  {...formik.getFieldProps("lastname")}
                  type="text"
                  placeholder="Last Name"
                  className="textbox"
                />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  type="text"
                  placeholder="Contact Number"
                  className="textbox"
                />
                <input
                  {...formik.getFieldProps("email")}
                  type="text"
                  placeholder="Email"
                  className="textbox"
                />
              </div>

              <input
                {...formik.getFieldProps("address")}
                type="text"
                placeholder="Address"
                className="textbox"
              />

              <button type="submit" className="btn">
                Register
              </button>
            </div>
            <div className="text-center py-2">
              <span className="text-gray-500">
                <Link className="text-red-500" to="/">
                  Log Out
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

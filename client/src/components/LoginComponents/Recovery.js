import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../Login-Stylesheet/Username.css";
import { Toaster } from "react-hot-toast";

export default function Recovery() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      // User is present in localStorage, so redirect to /home
      navigate("/");
    }
  });
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center h-screen">
        <div className="glass recover">
          <div className="heading title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Let's Recover Your Account.
            </span>
          </div>
          <form className="form">
            <div className="main_working_box">
              <div className=" text-center">
                <span className="text-sm text-left text-gray-500">
                  Please Enter 6 Digit OTP sent to your Email.{" "}
                </span>
                <input
                  type="password"
                  placeholder="OTP"
                  className="gap textbox"
                />
              </div>
              <button type="submit" className="btn">
                Enter
              </button>
            </div>
            <div className="text-center py-4">
              <div className="forgot_password_new_user">
                <div className="text-gray-500">
                  Send the OTP Again?{" "}
                  <Link className="text-red-500" to="/recover">
                    Resend
                  </Link>
                </div>
                <Link className="text-red-500" to="/username">
                  Back to Home Page
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

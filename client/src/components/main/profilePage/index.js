import React, { useEffect, useState } from "react";
import "./index.css";
import { getLocalUser, updateUser } from "../../../validation/helper";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "Hetan Thakkar",
    username: "johndoe",
    email: "johndoe@example.com",
    profilePic: "https://via.placeholder.com/150",
    github: "https://github.com/johndoe",
    about:
      "I am a passionate software engineer with a love for building innovative web applications.",
  });
  const fetchUser = async () => {
    let localUser = await getLocalUser();
    console.log("local", localUser);
    // const token = localStorage.getItem('token');

    const response = await axios.get(`/api/user/${localUser?.username}`, {
      headers: {
        Authorization: `Bearer ${localUser?.token}`,
      },
    });
    // const response = await axios.get(`/api/user/${localUser?.username}`);
    console.log("this is response", response.data);
    setUser(response.data);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  const [isEditing, setIsEditing] = useState({
    name: false,
    username: false,
    email: false,
    about: false,
    github: false,
  });

  const toggleEditing = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChange = (e, field) => {
    console.log("oau");

    setUser((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    }));
  };

  const disableEditing = async (field) => {
    let response = await updateUser(user);
    // console.log("commmm", response, response.data, response.status == 201);
    if (response.data.status == 201) {
      // Update the local copy of the user in localStorage
      // const updatedUser = response.data;
      // console.log("updated user")
      const localUser = await getLocalUser();
      const updatedLocalUser = { ...localUser, ...user };
      console.log("hiiii", updatedLocalUser, "update");
      localStorage.setItem("user", JSON.stringify(updatedLocalUser));

      // Update the state with the new user data
      setUser(updatedLocalUser);
      fetchUser();
      setIsEditing((prevState) => ({
        ...prevState,
        [field]: false,
      }));
    } else {
      console.error("Error updating user:", response.data);
    }
    console.log("Response is", response);
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: false,
    }));
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img src={user.profilePic} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <div className="profile-field">
            {isEditing.name ? (
              <>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => handleChange(e, "name")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("name")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("name")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
          <div className="profile-field">
            {isEditing.username ? (
              <>
                <input
                  type="text"
                  value={user.username}
                  onChange={(e) => handleChange(e, "username")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("username")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <h3>{user.username}</h3>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("username")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-field">
          {isEditing.email ? (
            <>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange(e, "email")}
              />
              <button
                className="save-button"
                onClick={() => disableEditing("email")}
              >
                <i className="fas fa-check"></i>
              </button>
            </>
          ) : (
            <>
              <p>{user.email}</p>
              <button
                className="edit-button"
                onClick={() => toggleEditing("email")}
              >
                <i className="fas fa-pen"></i>
              </button>
            </>
          )}
        </div>
        <div className="profile-section">
          <h4>About</h4>
          <div className="profile-field">
            {isEditing.about ? (
              <>
                <textarea
                  value={user.about}
                  onChange={(e) => handleChange(e, "about")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("about")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <p>{user.about}</p>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("about")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="profile-section">
          <h4>GitHub</h4>
          <div className="profile-field">
            {isEditing.github ? (
              <>
                <input
                  type="text"
                  value={user.github}
                  onChange={(e) => handleChange(e, "github")}
                />
                <button
                  className="save-button"
                  onClick={() => disableEditing("github")}
                >
                  <i className="fas fa-check"></i>
                </button>
              </>
            ) : (
              <>
                <a href={user.github} target="_blank" rel="noopener noreferrer">
                  {user.github}
                </a>
                <button
                  className="edit-button"
                  onClick={() => toggleEditing("github")}
                >
                  <i className="fas fa-pen"></i>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

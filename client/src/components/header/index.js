import { useNavigate } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import { getLocalUser, logout } from "../../validation/helper";

const Header = ({ search, setQuesitonPage, setProfile }) => {
  const [val, setVal] = useState(search);
  const navigate = useNavigate();
  const handleSignout = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      let user = await getLocalUser();
      console.log("user is", user);
      await logout(user?.username);
      navigate("/");
    }
  };
  const handleShowProfile = () => {
    console.log("adikps");
    setProfile(true);
  };

  const handleSearch = () => {
    // Trim the search value and only search if it's not empty
    const trimmedSearch = val.trim();
    if (trimmedSearch) {
      console.log("searching", trimmedSearch);
      setQuesitonPage(trimmedSearch, trimmedSearch);
    }
  };
  return (
    <div id="header" className="header">
      <div className="title">Fake Stack Overflow</div>
      <input
        className="searchbar"
        id="searchBar"
        placeholder="Search ..."
        type="text"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
      />
      <div className="Profile_signout">
        <button onClick={handleShowProfile}>Profile</button>
        <button onClick={handleSignout}>Sign Out</button>
      </div>
    </div>
  );
};

export default Header;

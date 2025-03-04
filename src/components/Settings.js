import React, { useState } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaEye,
  FaLock,
  FaHeadphones,
  FaInfoCircle,
} from "react-icons/fa";
import "../App.css";

function Settings() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [themeMessage, setThemeMessage] = useState("");

  const handleSettingClick = (setting) => {
    setSelectedSetting(setting);
  };

  const handleThemeChange = (theme) => {
    setThemeMessage(`${theme} mode has been applied.`);
    setTimeout(() => setThemeMessage(""), 2000);
  };

  const settingsData = {
    Account: (
      <div className="setting-detail">
        <h3>Account Information</h3>
        <p><strong>Username:</strong> JohnDoe123</p>
        <p><strong>Email:</strong> johndoe@example.com</p>
        <p><strong>Date of Birth:</strong> 01/01/1990</p>
        <p><strong>Password:</strong> *********</p>
      </div>
    ),
    Appearance: (
      <div className="setting-detail">
        <h3>Appearance</h3>
        <button onClick={() => handleThemeChange("Dark")}>Dark Mode</button>
        <button onClick={() => handleThemeChange("Light")}>Light Mode</button>
        {themeMessage && <p className="theme-message">{themeMessage}</p>}
      </div>
    ),
    "Privacy & Security": (
      <div className="setting-detail">
        <h3>Privacy & Security</h3>
        <p>
          Our app ensures secure data encryption and prevents identity theft
          using advanced security measures.
        </p>
        <h4>Forgot Password?</h4>
        <p>
          If you forget your password, use the password recovery option in the
          login page or contact support.
        </p>
      </div>
    ),
    "Help and Support": (
      <div className="setting-detail">
        <h3>Help & Support</h3>
        <p>
          For any issues, reach out to us at <strong>support@4kast.ai</strong>
        </p>
        <p>Or chat with our AI assistant for instant support.</p>
      </div>
    ),
    About: (
      <div className="setting-detail">
        <h3>About Our App</h3>
        <p>
          Our demand forecasting app provides real-time insights, helping
          businesses make data-driven decisions with accuracy.
        </p>
        <p>Why choose us?</p>
        <ul>
          <li>AI-powered predictions</li>
          <li>Seamless integration with your workflow</li>
          <li>Trusted by top businesses worldwide</li>
        </ul>
      </div>
    ),
  };

  return (
    <div className="settings-container">
      {/* Header Section */}
      <div className="settings-header">
        <FaArrowLeft className="back-icon" />
        <h2>Settings</h2>
      </div>

      {/* Search Bar */}
      <div className="settings-search">
        <input type="text" placeholder="Search for a setting..." />
      </div>

      {/* Settings Options */}
      <div className="settings-options">
        {[
          { icon: <FaUser />, label: "Account" },
          { icon: <FaEye />, label: "Appearance" },
          { icon: <FaLock />, label: "Privacy & Security" },
          { icon: <FaHeadphones />, label: "Help and Support" },
          { icon: <FaInfoCircle />, label: "About" },
        ].map((item, index) => (
          <div
            key={index}
            className={`settings-item ${selectedSetting === item.label ? "active" : ""}`}
            onClick={() => handleSettingClick(item.label)}
          >
            <div className="settings-icon">{item.icon}</div>
            <span>{item.label}</span>
            <span className="arrow">›</span>

            {/* Right-Side Pop-Up */}
            {selectedSetting === item.label && (
              <div className="submenu-container">
                <button className="close-btn" onClick={() => setSelectedSetting(null)}>×</button>
                {settingsData[selectedSetting]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;

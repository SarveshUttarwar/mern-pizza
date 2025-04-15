import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaUser,
  FaEye,
  FaLock,
  FaHeadphones,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import "../App.css";

function Settings() {
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [themeMessage, setThemeMessage] = useState("");
  const [theme, setTheme] = useState("light");
  const [username, setUsername] = useState("");
  const [note, setNote] = useState("");
  const [noteStatus, setNoteStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    console.log(`Applying ${theme}-mode`);
    document.body.className = theme === "dark" ? "light-mode" : "light-mode";
  }, [theme]);

  const handleSettingClick = (setting) => {
    console.log(`Clicked on ${setting}, current selected: ${selectedSetting}`);
    setSelectedSetting(prev => prev === setting ? null : setting);
  };

  const handleThemeChange = (themeMode) => {
    const newTheme = themeMode.toLowerCase();
    setTheme(newTheme);
    setThemeMessage(`${themeMode} mode has been applied.`);
    setTimeout(() => setThemeMessage(""), 2000);
  };

  const handleLogout = () => {
    Cookies.remove('username');
    Cookies.remove('authToken');
    console.log('Cookies removed, redirecting to login...');
    navigate('/login');
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      setNoteStatus("Please enter a note before sending.");
      return;
    }

    try {
      // Simulate sending email to sarveshuttarwar@gmail.com via a backend API
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'sarveshuttarwar@gmail.com',
          from: username ? `${username}@example.com` : 'anonymous@example.com',
          subject: 'User Note from Stellium App',
          body: note,
        }),
      });

      if (response.ok) {
        console.log("Note sent:", note);
        setNoteStatus("Note sent successfully to sarveshuttarwar@gmail.com!");
        setNote("");
        setTimeout(() => setNoteStatus(""), 3000);
      } else {
        throw new Error("Failed to send note");
      }
    } catch (error) {
      console.error("Error sending note:", error);
      setNoteStatus("Failed to send note. Please try again.");
    }
  };

  const settingsData = {
    Account: (
      <div className="setting-detail">
        <h3>Account Information</h3>
        <p><strong>Username:</strong> {username || "Not logged in"}</p>
        <p><strong>Email:</strong> {username ? `${username}@example.com` : "Not available"}</p>
        <p><strong>Password:</strong> ******** (Click to reveal: <button onClick={() => alert("Password functionality not implemented")}>Reveal</button>)</p>
        <h4>Account Settings</h4>
        <p>Manage your account preferences, update your email, or change your password.</p>
        <button onClick={() => alert("Update email functionality not implemented")}>Update Email</button>
        <button onClick={() => alert("Change password functionality not implemented")}>Change Password</button>
        <h4>Two-Factor Authentication</h4>
        <p>Enable two-factor authentication for enhanced security. Receive a code via email or SMS for login verification.</p>
        <button onClick={() => alert("2FA setup not implemented")}>Enable 2FA</button>
        <h4>Send us a note</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={handleNoteSubmit}>Send Note</button>
        {noteStatus && <p className="note-status">{noteStatus}</p>}
      </div>
    ),
    Appearance: (
      <div className="setting-detail">
        <h3>Appearance</h3>
        <p>Customize the look and feel of the app to suit your preferences.</p>
        <div className="theme-buttons">
          <button onClick={() => handleThemeChange("Dark")}>Dark Mode</button>
          <button onClick={() => handleThemeChange("Light")}>Light Mode</button>
        </div>
        {themeMessage && <p className="theme-message">{themeMessage}</p>}
        <h4>Font Size</h4>
        <p>Adjust the text size for better readability.</p>
        <select onChange={(e) => alert(`Font size ${e.target.value} not implemented`)}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
        <h4>Color Scheme</h4>
        <p>Choose a color scheme that matches your style.</p>
        <button onClick={() => alert("Custom color scheme not implemented")}>Customize Colors</button>
        <h4>Send us a note</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={handleNoteSubmit}>Send Note</button>
        {noteStatus && <p className="note-status">{noteStatus}</p>}
      </div>
    ),
    "Privacy & Security": (
      <div className="setting-detail">
        <h3>Privacy & Security</h3>
        <p>We collect minimal data to enhance your experience, including usage statistics and preferences, processed securely with AES-256 encryption. We do not share your data with third parties except as required by law or with your consent, similar to policies seen in apps like WhatsApp or Google. Cookies are used for session management, and you can manage them via your browser settings.</p>
        <h4>Data Deletion</h4>
        <p>Request data deletion by emailing askus@stellium.com, and we’ll process it within 30 days, aligning with GDPR standards.</p>
        <h4>Cookie Preferences</h4>
        <p>Manage which cookies you allow for analytics and personalization.</p>
        <button onClick={() => alert("Cookie preferences not implemented")}>Manage Cookies</button>
        <h4>Security Logs</h4>
        <p>View recent login activity to ensure your account is secure.</p>
        <button onClick={() => alert("View security logs not implemented")}>View Login History</button>
        <h4>Send us a note</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={handleNoteSubmit}>Send Note</button>
        {noteStatus && <p className="note-status">{noteStatus}</p>}
      </div>
    ),
    "Help and Support": (
      <div className="setting-detail">
        <h3>Help & Support</h3>
        <h4>Frequently Asked Questions</h4>
        <ul>
          <li><strong>How do I start a forecast?</strong> Go to the dashboard, select your dataset, and click 'Run Forecast'.</li>
          <li><strong>Why is my forecast inaccurate?</strong> Ensure your data is clean and covers at least 6 months. Check settings for correct parameters.</li>
          <li><strong>How do I export results?</strong> Use the 'Export' button in the forecast results section to download as CSV.</li>
          <li><strong>Who can I contact for issues?</strong> Email us at askus@stellium.com with your query.</li>
          <li><strong>Which is your best ML model currently which gives the highest accuracy?</strong> Currently, the ARIMA model we are using gives the highest accuracy when compared to other models.</li>
          <li><strong>How can I improve my forecast accuracy?</strong> Use high-quality, consistent data and experiment with different model parameters in the advanced settings.</li>
          <li><strong>Is there a tutorial for beginners?</strong> Yes, check our YouTube channel or the 'Getting Started' guide in the dashboard.</li>
        </ul>
        <h4>Live Support</h4>
        <p>Connect with our support team during business hours (9 AM - 5 PM EST).</p>
        <button onClick={() => alert("Live chat not implemented")}>Start Live Chat</button>
        <h4>Community Forum</h4>
        <p>Join our community forum to discuss tips and tricks with other users.</p>
        <button onClick={() => alert("Community forum not implemented")}>Visit Forum</button>
        <p>For further assistance, contact us at <strong>askus@stellium.com</strong>.</p>
        <h4>Send us a note</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={handleNoteSubmit}>Send Note</button>
        {noteStatus && <p className="note-status">{noteStatus}</p>}
      </div>
    ),
    About: (
      <div className="setting-detail">
        <h3>About Stellium Inc.</h3>
        <p>Founded in 2015, Stellium Inc. has been a pioneer in AI-driven solutions, starting with predictive analytics for retail. Our demand forecasting app, launched in 2022, leverages cutting-edge machine learning to empower businesses with accurate demand predictions, reducing waste and optimizing inventory.</p>
        <p>Our mission is to transform data into actionable insights, trusted by over 500 companies globally.</p>
        <h4>Our Team</h4>
        <p>We are a diverse team of data scientists, engineers, and business experts passionate about innovation.</p>
        <h4>Our Vision</h4>
        <p>To make AI accessible to every business, enabling smarter decisions through data.</p>
        <h4>Contact Us</h4>
        <p>Reach out to us at <strong>askus@stellium.com</strong> or visit our website at <a href="https://stellium.com">stellium.com</a>.</p>
        <h4>Send us a note</h4>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your note here..."
          rows="4"
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button onClick={handleNoteSubmit}>Send Note</button>
        {noteStatus && <p className="note-status">{noteStatus}</p>}
      </div>
    ),
  };

  return (
    <div className={`settings-container ${theme}-mode`}>
      <div className="settings-header">
        <FaArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>Settings</h2>
      </div>
      <div className="settings-search">
        <input type="text" placeholder="Search for a setting..." />
      </div>
      <div className="settings-options">
        {[
          { icon: <FaUser />, label: "Account" },
          { icon: <FaEye />, label: "Appearance" },
          { icon: <FaLock />, label: "Privacy & Security" },
          { icon: <FaHeadphones />, label: "Help and Support" },
          { icon: <FaInfoCircle />, label: "About" },
        ].map((item, index) => (
          <div key={index} className="settings-item-container">
            <div 
              className={`settings-item ${selectedSetting === item.label ? 'active' : ''}`} 
              onClick={() => handleSettingClick(item.label)}
            >
              <div className="settings-left">
                <span className="settings-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="arrow">›</span>
            </div>
            {selectedSetting === item.label && (
              <div className="submenu-container">
                {settingsData[selectedSetting]}
              </div>
            )}
          </div>
        ))}
        <div className="settings-item logout-item" onClick={handleLogout}>
          <div className="settings-left">
            <span className="settings-icon"><FaArrowLeft /></span>
            <span>Logout</span>
          </div>
          <span className="arrow">›</span>
        </div>
      </div>
    </div>
  );
}

export default Settings;
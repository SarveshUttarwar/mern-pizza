import React from "react";
import "../App.css"; // Ensure this file contains the styling below
import { FaUserCircle } from "react-icons/fa";

function ProfileDashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Finance Dashboard</h2>
        <div className="user-profile">
          <FaUserCircle className="user-icon" />
          <span>Hello, Sam!</span>
        </div>
      </div>

      {/* Profile & Skills Section */}
      <div className="dashboard-content">
        {/* Profile Card */}
        <div className="profile-card">
          <img
            src="https://via.placeholder.com/150"
            alt="User"
            className="profile-img"
          />
          <h3>My Profile</h3>
          <p><strong>Name:</strong> Sam Doe</p>
          <p><strong>Email:</strong> samdoe@example.com</p>
          <button className="profile-edit-btn">Edit Profile</button>
        </div>

        {/* Shop Accounts */}
        <div className="shop-accounts-card">
          <h3>My Shop Accounts</h3>
          <div className="account-status">
            <span>Amazon</span>
            <span className="status active">Active</span>
          </div>
          <div className="account-status">
            <span>Etsy</span>
            <span className="status inactive">Inactive</span>
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills-card">
          <h3>My Skills</h3>
          <div className="skill">
            <span>React</span>
            <span className="skill-level high">✔</span>
          </div>
          <div className="skill">
            <span>CSS</span>
            <span className="skill-level medium">✔</span>
          </div>
          <div className="skill">
            <span>JavaScript</span>
            <span className="skill-level low">✖</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;

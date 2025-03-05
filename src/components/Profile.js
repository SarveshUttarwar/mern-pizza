import React, { useState } from "react";
import "../App.css"; // Ensure your CSS file is correctly linked
import { FaUserCircle } from "react-icons/fa";

function ProfileDashboard() {
  const [profileImage, setProfileImage] = useState(null);
  const [imageInput, setImageInput] = useState("");
  const [fileInput, setFileInput] = useState(null);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Function to handle image URL input
  const handleImageURLUpload = () => {
    if (imageInput.trim() !== "") {
      setProfileImage(imageInput);
      setImageInput("");
    }
  };

  // Function to remove the profile picture
  const removeProfilePicture = () => {
    setProfileImage(null);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Finance Dashboard</h2>
        <div className="user-profile">
          <FaUserCircle className="user-icon" />
          <span><strong>Hello, Sarvesh!</strong></span>
        </div>
      </div>

      {/* Profile & Skills Section */}
      <div className="dashboard-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-image-container">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="profile-img" />
            ) : (
              <FaUserCircle className="default-avatar three-d-avatar" />
            )}
          </div>

          <h3>My Profile</h3>
          <p><strong>Name:</strong> Sarvesh</p>
          <p><strong>Email:</strong> sarvesh@example.com</p>

          {/* Image Upload Section */}
          <div className="upload-section">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              style={{ display: "none" }} 
              ref={(fileInput) => setFileInput(fileInput)} 
            />
            <button className="upload-btn" onClick={() => fileInput.click()}>
              Upload Image
            </button>
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <button className="upload-btn" onClick={handleImageURLUpload}>
              Upload from URL
            </button>
            {profileImage && (
              <button className="remove-btn" onClick={removeProfilePicture}>
                Remove Photo
              </button>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills-card three-d-effect">
          <h3>💡 My Skills</h3>
          <ul>
            <li><strong>Visualization Tools</strong></li>
            <li><strong>SAP BTP</strong></li>
            <li><strong>Software Development</strong></li>
            <li><strong>Data Analysis</strong></li>
            <li><strong>Machine Learning</strong></li>
            <li><strong>Frontend Development</strong></li>
          </ul>
        </div>

        {/* About Section */}
        <div className="about-card three-d-effect">
          <h3>📝 About Me</h3>
          <p>
            <strong>Software developer with 2 years of experience</strong> in Python, SQL, and C++, 
            specializing in data analysis, machine learning, and web development. 
            Proficient in frontend technologies such as Dart and React, with hands-on 
            experience in RFgen software. Strong problem-solving and critical-thinking 
            abilities, complemented by skills in data visualization using Power BI and Tableau.
            A proactive learner with a proven track record in academic excellence.
          </p>
        </div>

        {/* Experience Section */}
        <div className="experience-card three-d-effect">
          <h3>📌 Experience</h3>
          <ul>
            <li>
              <strong>Developed the frontend</strong> for HHT (Handheld Terminal) and Admin Screens using
              Flutter (Dart) and React. Contributed to database design for efficient inventory tracking.
            </li>
            <li>
              <strong>Built the frontend using React</strong> for an advanced ML-driven demand forecasting tool.
              The solution integrates statistical models with state-of-the-art machine learning techniques.
            </li>
            <li>
              <strong>Developed two RFgen applications</strong> for a company in Saudi Arabia, enabling real-time
              scanning, tracking, and inventory validation.
            </li>
            <li>
              <strong>Worked on algorithm development</strong>, dataset analysis, and testing for product classification
              using ABC-FMS analysis. Developed 3D visualizations for warehouse layout and optimization.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;

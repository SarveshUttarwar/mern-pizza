// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar"; 
// import Dashboard from "./components/dashboard";
// import ImportData from "./components/Import";
// import ForecastSettings from "./components/forecastsettings";
// import PlannerWorkbench from "./components/PlannerWorkbench.js"; // ✅ Fixed import
// import MasterData from "./components/masterdata.js";
// import IAMPage from "./components/IAM.js";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         <Sidebar />
//         <div className="main-content">
//           <Navbar /> 
//           <div className="content">
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/import" element={<ImportData />} />
//               <Route path="/forecast-settings" element={<ForecastSettings />} />
//               <Route path="/planner-workbench" element={<PlannerWorkbench />} /> {/* ✅ Fixed Routing */}
//               <Route path="/master-data" element={<MasterData />} />
//               <Route path="/iam" element={<IAMPage />} />
              
//               {/* Route path="/settings" element={</>} /> */}
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar"; 
// import Dashboard from "./components/dashboard";
// import ImportData from "./components/Import";
// import ForecastSettings from "./components/forecastsettings";
// import PlannerWorkbench from "./components/PlannerWorkbench.js"; 
// import MasterData from "./components/masterdata.js";
// import IAMPage from "./components/IAM.js";
// import Notifications from "./components/Notifications";
// import Settings from "./components/Settings";
// import Profile from "./components/Profile";
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <div className="app-container">
//         <Sidebar />
//         <div className="main-content">
//           <Navbar /> 
//           <div className="content">
//             <Routes>
//               <Route path="/" element={<login />} />
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/import" element={<ImportData />} />
//               <Route path="/forecast-settings" element={<ForecastSettings />} />
//               <Route path="/planner-workbench" element={<PlannerWorkbench />} />
//               <Route path="/master-data" element={<MasterData />} />
//               <Route path="/iam" element={<IAMPage />} />
              
//               {/* New Navbar Routes */}
//               <Route path="/notifications" element={<Notifications />} />
//               <Route path="/settings" element={<Settings />} />
//               <Route path="/profile" element={<Profile />} />
//             </Routes>
//           </div>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
// // src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/dashboard';
import ImportData from './components/Import';
import ForecastSettings from './components/forecastsettings';
import PlannerWorkbench from './components/PlannerWorkbench.js';
import MasterData from './components/masterdata.js';
import IAMPage from './components/IAM.js';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default route redirects to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <Dashboard />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/import"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <ImportData />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/forecast-settings"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <ForecastSettings />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/planner-workbench"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <PlannerWorkbench />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/master-data"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <MasterData />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/iam"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <IAMPage />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <Notifications />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <Settings />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Sidebar />
                <div className="main-content">
                  <Navbar />
                  <div className="content">
                    <Profile />
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
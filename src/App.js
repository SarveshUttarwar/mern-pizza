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

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar"; 
import Dashboard from "./components/dashboard";
import ImportData from "./components/Import";
import ForecastSettings from "./components/forecastsettings";
import PlannerWorkbench from "./components/PlannerWorkbench.js"; 
import MasterData from "./components/masterdata.js";
import IAMPage from "./components/IAM.js";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar /> 
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/import" element={<ImportData />} />
              <Route path="/forecast-settings" element={<ForecastSettings />} />
              <Route path="/planner-workbench" element={<PlannerWorkbench />} />
              <Route path="/master-data" element={<MasterData />} />
              <Route path="/iam" element={<IAMPage />} />
              
              {/* New Navbar Routes */}
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

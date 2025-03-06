// import React, { useState, useEffect, useRef } from "react";
// import Chart from "chart.js/auto";

// const PlannerWorkbench = () => {
//   const [expandedCategories, setExpandedCategories] = useState([]);
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [timeBucket, setTimeBucket] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [tableData, setTableData] = useState(null);
//   const [showGraph, setShowGraph] = useState(false);

//   const chartRef1 = useRef(null);
//   const chartRef2 = useRef(null);
//   const chartInstance1 = useRef(null);
//   const chartInstance2 = useRef(null);

//   const handleSave = () => {
//     setShowGraph(true);
//   };

//   const handleRefresh = () => {
//     setExpandedCategories([]);
//     setSelectedCategories([]);
//     setTimeBucket("");
//     setStartDate("");
//     setEndDate("");
//     setTableData(null);
//     setShowGraph(false);

//     if (chartInstance1.current) {
//       chartInstance1.current.destroy();
//     }
//     if (chartInstance2.current) {
//       chartInstance2.current.destroy();
//     }
//   };

//   const generateRandomData = () => {
//     return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10000) + 1000);
//   };

//   useEffect(() => {
//     if (selectedCategories.length > 0 && timeBucket && startDate && endDate) {
//       setTableData({
//         "Consensus Demand": generateRandomData(),
//         "Baseline Forecast": generateRandomData(),
//         "Adjusted Demand": generateRandomData(),
//       });
//     } else {
//       setTableData(null);
//     }
//   }, [selectedCategories, timeBucket, startDate, endDate]);

//   useEffect(() => {
//     if (showGraph && tableData) {
//       if (chartInstance1.current) chartInstance1.current.destroy();
//       if (chartInstance2.current) chartInstance2.current.destroy();

//       const ctx1 = chartRef1.current.getContext("2d");
//       chartInstance1.current = new Chart(ctx1, {
//         type: "line",
//         data: {
//           labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//           datasets: [
//             {
//               label: "Actual Quantity",
//               data: tableData["Actual Sales"],
//               borderColor: "blue",
//               fill: false,
//             },
//             {
//               label: "Forecast Quantity",
//               data: tableData["Statistical Forecast"],
//               borderColor: "red",
//               fill: false,
//             },
//           ],
//         },
//       });

//       const ctx2 = chartRef2.current.getContext("2d");
//       chartInstance2.current = new Chart(ctx2, {
//         type: "bar",
//         data: {
//           labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//           datasets: [
//             {
//               label: "Quantity",
//               data: tableData["Actual Sales"],
//               backgroundColor: "green",
//             },
//             {
//               label: "Revenue",
//               data: tableData["Actual Sales"].map(value => value * 10),
//               backgroundColor: "orange",
//             },
//           ],
//         },
//       });
//     }
//   }, [showGraph, tableData]);

//   const displayCategories = {
//     "All Items": {
//       subcategories: {
//         "Consumer Goods": {
//           subcategories: {
//             Electronics: {},
//             Furniture: {},
//             "Sporting Goods": {},
//           },
//         },
//         Fashion: {
//           subcategories: {
//             "Clothing Summer Style": {},
//             "T-Shirts": {},
//           },
//         },
//         "Food/Beverages": {
//           subcategories: {
//             Cereals: {},
//             Chocolate: {},
//             Water: {},
//           },
//         },
//       },
//     },
//   };

//   const toggleCategoryExpansion = (category) => {
//     setExpandedCategories((prev) =>
//       prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
//     );
//   };

//   const toggleCategorySelection = (category) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
//     );
//   };

//   const renderCategories = (category, data, level = 0) => (
//     <div key={category} className="category-item" style={{ paddingLeft: `${level * 15}px` }}>
//       <div className="category-header">
//         <span className="expand-toggle" onClick={() => toggleCategoryExpansion(category)}>
//           {expandedCategories.includes(category) ? "▼" : "▶"}
//         </span>
//         <label>
//           <input
//             type="checkbox"
//             checked={selectedCategories.includes(category)}
//             onChange={() => toggleCategorySelection(category)}
//           />
//           <strong>{category}</strong>
//         </label>
//       </div>
//       {expandedCategories.includes(category) &&
//         data.subcategories &&
//         Object.entries(data.subcategories).map(([sub, subData]) =>
//           renderCategories(sub, subData, level + 1)
//         )}
//     </div>
//   );

//   return (
//     <div className="planner-container">
//       <h2 className="demand-plan-title">Demand Plan</h2>

//       <div className="top-section">
//         <div className="display-settings card">
//           <h4>Display Settings</h4>
//           {Object.entries(displayCategories).map(([category, data]) => renderCategories(category, data))}
//         </div>
//         <div className="time-horizon card">
//           <h4>Time Horizon</h4>
//           <div className="time-horizon-controls">
//             <label>
//               Time Bucket:
//               <select className="styled-select" value={timeBucket} onChange={(e) => setTimeBucket(e.target.value)}>
//                 <option value="">Select</option>
//                 <option>Monthly</option>
//                 <option>Weekly</option>
//                 <option>Quarterly</option>
//                 <option>Yearly</option>
//               </select>
//             </label>
//             <label>
//               Start Date:
//               <input type="date" className="date-picker" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//             </label>
//             <label>
//               End Date:
//               <input type="date" className="date-picker" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//             </label>
//           </div>
//         </div>
//       </div>

//       {tableData && (
//         <div className="data-table card">
//           <table>
//             <thead>
//               <tr>
//                 <th>Metrics</th>
//                 {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (
//                   <th key={idx}>{month} 2023</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {Object.entries(tableData).map(([metric, values], idx) => (
//                 <tr key={idx}>
//                   <td>{metric}</td>
//                   {values.map((value, index) => (
//                     <td key={index} className={metric === "Final Forecast Overrides" ? "highlight" : ""}>
//                       {value}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div className="worksheet card">
//         <h4>Quantity vs. Forecast Graph</h4>
//         <canvas ref={chartRef1}></canvas>
//       </div>

//       <div className="worksheet card">
//         <h4>Quantity vs. Revenue Graph</h4>
//         <canvas ref={chartRef2}></canvas>
//       </div>

//       <div className="button-group">
//         <button className="btn refresh" onClick={handleRefresh}>Refresh</button>
//         <button className="btn save" onClick={handleSave}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default PlannerWorkbench;

import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../App.css";

const availableMetrics = [
  "Adjusted Demand",
  "Consensus Demand",
  "Baseline Forecast",
  "Actual Sale",
  "PY_1",
  "PY_2",
  "PY_3",
];

const itemsOptions = ["Consumer", "Fashion", "Food", "Pharma", "Transport", "Heavy Industry"];
const locationsOptions = ["Area", "City", "State", "Country"];
const customersOptions = ["Online", "Offline"];

const PlannerWorkbench = () => {
  const [selectedItem, setSelectedItem] = useState("All Items");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCustomer, setSelectedCustomer] = useState("All Customers");

  const [timeBucket, setTimeBucket] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tableData, setTableData] = useState(null);

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Function to generate random data
  const generateRandomData = (size) =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 10000) + 1000);

  // Handle time bucket selection
  const handleTimeBucketChange = (e) => {
    const bucket = e.target.value;
    setTimeBucket(bucket);

    let periodSize = 14; // Default to 14 days
    if (bucket === "Weekly") periodSize = 7;
    if (bucket === "Monthly") periodSize = 30;

    const newData = {};
    availableMetrics.forEach((metric) => {
      newData[metric] = generateRandomData(periodSize);
    });
    setTableData(newData);
  };

  // Effect to render the graph when data updates
  useEffect(() => {
    if (tableData && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      // Define labels dynamically
      const labels = Array.from(
        { length: Object.values(tableData)[0]?.length || 14 },
        (_, i) => `Day ${i + 1}`
      );

      // Actual vs Predicted split logic
      const splitIndex = Math.floor(labels.length / 2);
      const actualLabels = labels.slice(0, splitIndex);
      const predictedLabels = labels.slice(splitIndex);

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Actual Demand",
              data: tableData["Actual Sale"].slice(0, splitIndex),
              borderColor: "blue",
              fill: false,
            },
            {
              label: "Predicted Demand",
              data: tableData["Baseline Forecast"].slice(splitIndex),
              borderColor: "red",
              fill: false,
            },
          ],
        },
      });
    }
  }, [tableData]);

  return (
    <div className="planner-container">
      <h2 className="demand-plan-title">Demand Plan</h2>

      {/* Display Settings */}
      <div className="display-settings card">
        <h4>Display Settings</h4>
        <label>All Items:</label>
        <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="All Items">All Items</option>
          {itemsOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label>All Locations:</label>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="All Locations">All Locations</option>
          {locationsOptions.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <label>All Customers:</label>
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
          <option value="All Customers">All Customers</option>
          {customersOptions.map((customer, index) => (
            <option key={index} value={customer}>
              {customer}
            </option>
          ))}
        </select>
      </div>

      {/* Time Horizon Selection */}
      <div className="time-horizon card">
        <h4>Time Horizon</h4>
        <label>Time Bucket:</label>
        <select value={timeBucket} onChange={handleTimeBucketChange}>
          <option value="">Select</option>
          <option>Weekly</option>
          <option>14 Days</option>
          <option>Monthly</option>
        </select>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Table Display */}
      {tableData && (
        <div className="data-table card">
          <table>
            <thead>
              <tr>
                <th>Metrics</th>
                {Object.keys(tableData["Actual Sale"]).map((_, i) => (
                  <th key={i}>Day {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(tableData).map(([metric, values]) => (
                <tr key={metric}>
                  <td>{metric}</td>
                  {values.map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Graph Display */}
      <div className="graph-container card">
        <h3>Actual Demand vs. Predicted Demand</h3>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default PlannerWorkbench;


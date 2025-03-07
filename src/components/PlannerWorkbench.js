import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../App.css"
const availableMetrics = ["Actual Sale", "Baseline Forecast"];
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
    setTimeBucket(e.target.value);
  };

  // Handle date selection and update chart data
  useEffect(() => {
    if (startDate && endDate) {
      const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      if (duration > 0) {
        const actualStartDate = new Date(startDate);
        actualStartDate.setDate(actualStartDate.getDate() - duration);

        const actualLabels = Array.from({ length: duration }, (_, i) =>
          new Date(actualStartDate.getTime() + i * 86400000).toISOString().split("T")[0]
        );

        const predictedLabels = Array.from({ length: duration }, (_, i) =>
          new Date(new Date(startDate).getTime() + i * 86400000).toISOString().split("T")[0]
        );

        const newData = {
          "Actual Sale": generateRandomData(duration),
          "Baseline Forecast": generateRandomData(duration),
        };

        setTableData({ labels: predictedLabels, values: newData });

        if (chartRef.current) {
          if (chartInstance.current) {
            chartInstance.current.destroy();
          }

          const ctx = chartRef.current.getContext("2d");

          chartInstance.current = new Chart(ctx, {
            type: "line",
            data: {
              labels: [...actualLabels, ...predictedLabels],
              datasets: [
                {
                  label: "Actual Demand",
                  data: [...newData["Actual Sale"], ...Array(duration).fill(null)],
                  borderColor: "blue",
                  fill: false,
                },
                {
                  label: "Predicted Demand",
                  data: [...Array(duration).fill(null), ...newData["Baseline Forecast"]],
                  borderColor: "red",
                  fill: false,
                },
              ],
            },
          });
        }
      }
    }
  }, [startDate, endDate]);

  return (
    <div className="planner-container">
      <h2 className="demand-plan-title">Demand Plan</h2>

      {/* Display Settings */}
      
      <div className="time-horizon card">
        <h1>Display Settings</h1>
        <label>All Items:</label>
        <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="All Items">Items</option>
          {itemsOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label>All Locations:</label>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          <option value="All Locations">Locations</option>
          {locationsOptions.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>

        <label>All Customers:</label>
        <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
          <option value="All Customers">Customers</option>
          {customersOptions.map((customer, index) => (
            <option key={index} value={customer}>
              {customer}
            </option>
          ))}
        </select>
      </div>
      

      {/* Time Horizon Selection */}
      <div className="time-horizon card">
        <h1>Time Horizon</h1>
        <label>     Time Bucket:</label>
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

      {/* Table Display (Updated for Metrics) */}
      {tableData && (
        <div className="data-table card">
          <table>
            <thead>
              <tr>
                <th>Metrics</th>
                {tableData.labels.map((date, index) => (
                  <th key={index}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Adjusted Demand", "Consensus Demand", "Statistical Forecast", "Actual Sales", "PY_1", "PY_2", "PY_3"].map(
                (metric, index) => (
                  <tr key={index}>
                    <td>{metric}</td>
                    {tableData.labels.map((_, i) => (
                      <td key={i}>{Math.floor(Math.random() * 10000) + 1000}</td> // Placeholder random data
                    ))}
                  </tr>
                )
              )}
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

import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../App.css";

const availableMetrics = ["Actual Sale", "Baseline Forecast", "Sales Forecast", "PY_1", "PY_2", "PY_3"];
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

  // Generate random data for demo
  const generateRandomData = (size) =>
    Array.from({ length: size }, () => Math.floor(Math.random() * 10000) + 1000);

  // Handle time bucket selection
  const handleTimeBucketChange = (e) => {
    setTimeBucket(e.target.value);
  };

  // Validate dates and update chart/table
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (duration > 0) {
          const actualStartDate = new Date(start);
          actualStartDate.setDate(actualStartDate.getDate() - duration);

          const actualLabels = Array.from({ length: duration }, (_, i) =>
            new Date(actualStartDate.getTime() + i * 86400000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );

          const predictedLabels = Array.from({ length: duration }, (_, i) =>
            new Date(start.getTime() + i * 86400000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );

          const newData = {
            "Actual Sale": generateRandomData(duration),
            "Baseline Forecast": generateRandomData(duration),
            "Sales Forecast": generateRandomData(duration),
            "PY_1": generateRandomData(duration),
            "PY_2": generateRandomData(duration),
            "PY_3": generateRandomData(duration),
          };

          setTableData({ labels: predictedLabels, values: newData });

          if (chartRef.current) {
            if (chartInstance.current) chartInstance.current.destroy();
            const ctx = chartRef.current.getContext("2d");
            chartInstance.current = new Chart(ctx, {
              type: "line",
              data: {
                labels: [...actualLabels, ...predictedLabels],
                datasets: ["Actual Sale", "Baseline Forecast"].map((metric, index) => ({
                  label: metric,
                  data:
                    metric === "Actual Sale"
                      ? [...newData[metric], ...Array(duration).fill(null)]
                      : [...Array(duration).fill(null), ...newData[metric]],
                  borderColor: index === 0 ? "#007bff" : "#ff5733",
                  backgroundColor: index === 0 ? "rgba(0, 123, 255, 0.2)" : "rgba(255, 87, 51, 0.2)",
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  borderWidth: 2,
                })),
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top", labels: { color: "#1a202c", font: { size: 14 } } },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  x: {
                    grid: { color: "#e0e0e0", drawOnChartArea: false },
                    title: { display: true, text: "Date", color: "#1a202c" },
                  },
                  y: {
                    grid: { color: "#e0e0e0" },
                    title: { display: true, text: "Demand", color: "#1a202c" },
                    beginAtZero: true,
                  },
                },
              },
            });
          }
        }
      } else {
        setTableData(null); // Clear data if invalid
        if (chartInstance.current) chartInstance.current.destroy();
      }
    }
  }, [startDate, endDate]);

  return (
    <div className="planner-container">
      <h2 className="demand-plan-title">Demand Plan</h2>

      {/* Display Settings */}
      <div className="card display-settings">
        <h3 className="card-header">Display Settings</h3>
        <div className="card-body">
          <div className="input-group">
            <label>All Items:</label>
            <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
              <option value="All Items">Items</option>
              {itemsOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>All Locations:</label>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
              <option value="All Locations">Locations</option>
              {locationsOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>All Customers:</label>
            <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
              <option value="All Customers">Customers</option>
              {customersOptions.map((customer) => (
                <option key={customer} value={customer}>
                  {customer}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Time Horizon */}
      <div className="card time-horizon">
        <h3 className="card-header">Time Horizon</h3>
        <div className="card-body">
          <div className="input-group">
            <label>Time Bucket:</label>
            <select value={timeBucket} onChange={handleTimeBucketChange}>
              <option value="">Select</option>
              <option value="Weekly">Weekly</option>
              <option value="14 Days">14 Days</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div className="input-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table Display */}
      {tableData && (
        <div className="card data-table">
          <h3 className="card-header">Demand Data</h3>
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                {tableData.labels.map((date) => (
                  <th key={date}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {availableMetrics.map((metric) => (
                <tr key={metric}>
                  <td>{metric}</td>
                  {tableData.values[metric].map((value, index) => (
                    <td key={index}>{value ? value.toLocaleString() : "-"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Graph Display */}
      <div className="card graph-container">
        <h3 className="card-header">Actual Demand vs. Predicted Demand</h3>
        <div className="chart-wrapper">
          <canvas ref={chartRef} style={{ height: "300px" }}></canvas>
        </div>
      </div>
    </div>
  );
};

export default PlannerWorkbench;
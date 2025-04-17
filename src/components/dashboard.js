import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar
} from "recharts";
import Heatmap from "react-heatmap-grid";
import "../App.css";

function Dashboard() {
  // State for chart visibility
  const [chartVisibility, setChartVisibility] = useState({
    historical: true,
    growing: true,
    declining: true,
    heatmap: true,
    risk: true,
    error: true,
  });

  // State for selected data set
  const [selectedDataSet, setSelectedDataSet] = useState("default");

  // Data for KPI cards
  const kpiData = {
    totalDemand: 1500000,
    mape: 8.5,
    bias: -2.3,
    aiConfidence: 67,
  };

  // Base data sets
  const baseLineData = [
    { name: "ItemA", "2021": 60, "2022": 65, "2023": 70, "2024": 75, "2025": 80 },
    { name: "ItemB", "2021": 70, "2022": 75, "2023": 80, "2024": 85, "2025": 90 },
    { name: "ItemC", "2021": 80, "2022": 85, "2023": 90, "2024": 95, "2025": 100 },
    { name: "ItemD", "2021": 50, "2022": 55, "2023": 60, "2024": 65, "2025": 70 },
    { name: "ItemE", "2021": 90, "2022": 95, "2023": 100, "2024": 105, "2025": 110 },
  ];

  const baseGrowingData = [
    { name: "ItemF12", value: 100, base: 0 },
    { name: "ItemY6", value: 77.21, base: 0 },
    { name: "ItemE3", value: 84.14, base: 0 },
  ];

  const baseDecliningData = [
    { name: "ItemA", value: 84.82, base: 100 },
    { name: "ItemD", value: 62.24, base: 100 },
    { name: "ItemO", value: 38.82, base: 100 },
  ];

  const baseHeatmapData = [
    [90, 75, 60, 45, 30, 15], // High
    [85, 70, 55, 40, 25, 10], // Med
    [80, 65, 50, 35, 20, 5],  // Low
  ];

  const baseRiskFlagsData = [
    { name: "Under 10%", value: 20 },
    { name: "Over 10%", value: 30 },
    { name: "Within 10%", value: 70 },
  ];

  const baseErrorDistributionData = [
    { name: "0-20", value: 1.0 },
    { name: "20-40", value: 2.0 },
    { name: "40-60", value: 3.0 },
    { name: "60-80", value: 4.0 },
    { name: "80-100", value: 5.0 },
  ];

  // Alternative data sets
  const altLineData = [
    { name: "ItemF", "2021": 55, "2022": 60, "2023": 65, "2024": 70, "2025": 75 },
    { name: "ItemG", "2021": 65, "2022": 70, "2023": 75, "2024": 80, "2025": 85 },
    { name: "ItemH", "2021": 75, "2022": 80, "2023": 85, "2024": 90, "2025": 95 },
    { name: "ItemI", "2021": 45, "2022": 50, "2023": 55, "2024": 60, "2025": 65 },
    { name: "ItemJ", "2021": 85, "2022": 90, "2023": 95, "2024": 100, "2025": 105 },
  ];

  const altGrowingData = [
    { name: "ItemX1", value: 95, base: 0 },
    { name: "ItemY2", value: 82.34, base: 0 },
    { name: "ItemZ3", value: 78.56, base: 0 },
  ];

  const altDecliningData = [
    { name: "ItemB", value: 79.45, base: 100 },
    { name: "ItemE", value: 58.90, base: 100 },
    { name: "ItemP", value: 35.67, base: 100 },
  ];

  const altHeatmapData = [
    [85, 70, 55, 40, 25, 10], // High
    [80, 65, 50, 35, 20, 5],  // Med
    [75, 60, 45, 30, 15, 0],  // Low
  ];

  const altRiskFlagsData = [
    { name: "Under 5%", value: 15 },
    { name: "Over 15%", value: 25 },
    { name: "Within 15%", value: 60 },
  ];

  const altErrorDistributionData = [
    { name: "0-20", value: 0.5 },
    { name: "20-40", value: 1.5 },
    { name: "40-60", value: 2.5 },
    { name: "60-80", value: 3.5 },
    { name: "80-100", value: 4.5 },
  ];

  // Select data based on dropdown
  const getData = (chartType) => {
    switch (selectedDataSet) {
      case "alternate":
        switch (chartType) {
          case "line": return altLineData;
          case "growing": return altGrowingData;
          case "declining": return altDecliningData;
          case "heatmap": return altHeatmapData;
          case "risk": return altRiskFlagsData;
          case "error": return altErrorDistributionData;
          default: return [];
        }
      case "default":
      default:
        switch (chartType) {
          case "line": return baseLineData;
          case "growing": return baseGrowingData;
          case "declining": return baseDecliningData;
          case "heatmap": return baseHeatmapData;
          case "risk": return baseRiskFlagsData;
          case "error": return baseErrorDistributionData;
          default: return [];
        }
    }
  };

  // Toggle chart visibility
  const toggleChart = (chart) => {
    setChartVisibility((prev) => ({
      ...prev,
      [chart]: !prev[chart],
    }));
  };

  // Define labels for heatmap
  const xLabels = ["P1", "P2", "P3", "P4", "P5", "P6"];
  const yLabels = ["High", "Med", "Low"];

  return (
    <div className="dashboard">
      <div className="dashboard-controls">
        <select value={selectedDataSet} onChange={(e) => setSelectedDataSet(e.target.value)}>
          <option value="default">Default Data</option>
          <option value="alternate">Alternate Data</option>
        </select>
        <input type="date" placeholder="Start Date" />
        <input type="date" placeholder="End Date" />
      </div>
      <div className="kpi-container">
        <div className="kpi-card">
          <h4>Total Forecasted Demand</h4>
          <h2>{kpiData.totalDemand.toLocaleString()} units</h2>
        </div>
        <div className="kpi-card">
          <h4>Overall Forecast Accuracy</h4>
          <h2>MAPE: {kpiData.mape}%</h2>
        </div>
        <div className="kpi-card">
          <h4>Overall Bias</h4>
          <h2>Bias: {kpiData.bias}%</h2>
        </div>
        <div className="kpi-card">
          <h4>AI Confidence Score</h4>
          <h2>{kpiData.aiConfidence}%</h2>
        </div>
      </div>
      <div className="chart-controls">
        <button onClick={() => toggleChart("historical")}>Toggle Historical</button>
        <button onClick={() => toggleChart("growing")}>Toggle Growing</button>
        <button onClick={() => toggleChart("declining")}>Toggle Declining</button>
        <button onClick={() => toggleChart("heatmap")}>Toggle Heatmap</button>
        <button onClick={() => toggleChart("risk")}>Toggle Risk</button>
        <button onClick={() => toggleChart("error")}>Toggle Error</button>
      </div>
      <div className="charts-container">
        {chartVisibility.historical && (
          <div className="chart-box">
            <h4 className="chart-title">Historical vs. Forecasted Demand</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={getData("line")}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                {Object.keys(getData("line")[0])
                  .filter(key => key !== "name")
                  .map((year, index) => (
                    <Line
                      key={year}
                      type="monotone"
                      dataKey={year}
                      stroke={["#FF6F61", "#0078D4", "#FFD700", "#00C853", "#FF4444"][index % 5]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {chartVisibility.growing && (
          <div className="chart-box">
            <h4 className="chart-title">Top Growing Products</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getData("growing")}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#00C853" barSize={30} />
                <Bar dataKey="base" fill="#FFFFFF" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {chartVisibility.declining && (
          <div className="chart-box">
            <h4 className="chart-title">Top Declining Products</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getData("declining")}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#FF4444" barSize={30} />
                <Bar dataKey="base" fill="#FFFFFF" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {chartVisibility.heatmap && (
          <div className="chart-box">
            <h4 className="chart-title">Forecast Accuracy by Product</h4>
            <div style={{ height: 200 }}>
              <Heatmap
                xLabels={xLabels}
                yLabels={yLabels}
                data={getData("heatmap")}
                squares
                onClick={(x, y) => alert(`Clicked ${yLabels[y]} - ${xLabels[x]}: ${getData("heatmap")[y][x]}%`)}
                cellStyle={(background, value, min, max, data, x, y) => ({
                  background: `rgb(0, 151, 167, ${1.1 - value / 100})`,
                  fontSize: "12px",
                  color: "#fff",
                })}
                cellRender={(value) => value && `${value}%`}
                title={(value) => `${value}%`}
              />
            </div>
          </div>
        )}
        {chartVisibility.risk && (
          <div className="chart-box">
            <h4 className="chart-title">Risk Flags wrt Forecast Errors</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getData("risk")} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#666" }} width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B4513" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        {chartVisibility.error && (
          <div className="chart-box">
            <h4 className="chart-title">Forecast Error Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getData("error")}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#87CEEB" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
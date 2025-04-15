import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import "../App.css";

function Dashboard() {
  const lineData = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 120 },
    { name: "Mar", value: 150 },
    { name: "Apr", value: 130 },
    { name: "May", value: 180 },
    { name: "Jun", value: 200 },
    { name: "Jul", value: 400 },
    { name: "Aug", value: 250 },
    { name: "Sep", value: 190 },
    { name: "Oct", value: 400 },
    { name: "Nov", value: 175 },
    { name: "Dec", value: 100 },
  ];

  const barData = [
    { name: "Product A", sales: 240 },
    { name: "Product B", sales: 130 },
    { name: "Product C", sales: 280 },
    { name: "Product D", sales: 350 },
    { name: "Product E", sales: 270 },
    { name: "Product F", sales: 100 },
    { name: "Product G", sales: 380 },
    { name: "Product H", sales: 330 },
    { name: "Product I", sales: 240 },
    { name: "Product J", sales: 130 },
    { name: "Product K", sales: 280 },
    { name: "Product L", sales: 350 },
    { name: "Product M", sales: 240 },
    { name: "Product N", sales: 130 },
    { name: "Product O", sales: 280 },
    { name: "Product P", sales: 350 },
    { name: "Product Q", sales: 240 },
    { name: "Product R", sales: 130 },
    { name: "Product S", sales: 280 },
    { name: "Product T", sales: 350 },
  ];

  const scatterData = [
    { x: 10, y: 30 },
    { x: 20, y: 50 },
    { x: 30, y: 70 },
    { x: 40, y: 90 },
    { x: 50, y: 140 },
    { x: 60, y: 90 },
    { x: 70, y: 50 },
    { x: 80, y: 120 },
    { x: 90, y: 40 },
    { x: 100, y: 80 },
    { x: 110, y: 160 },
  ];

  const areaData = [
    { month: "Jan", revenue: 100 },
    { month: "Feb", revenue: 120 },
    { month: "Mar", revenue: 150 },
    { month: "Apr", revenue: 130 },
    { month: "May", revenue: 180 },
    { month: "Jun", revenue: 200 },
    { month: "Jul", revenue: 90 },
    { month: "Aug", revenue: 130 },
    { month: "Sep", revenue: 160 },
    { month: "Oct", revenue: 190 },
    { month: "Nov", revenue: 220 },
    { month: "Dec", revenue: 250 },
  ];

  const pieData = [
    { name: "Category A", value: 200 },
    { name: "Category B", value: 100 },
    { name: "Category C", value: 600 },
    { name: "Category D", value: 800 },
    { name: "Category E", value: 300 },
    { name: "Category F", value: 900 },
    { name: "Category G", value: 700 },
  ];
  const COLORS = ["#0078D4", "#005BA1", "#004578", "#003359", "#002540", "#001F3F", "#001528"];

  const [currentColor, setCurrentColor] = useState("#0078D4");
  const [index, setIndex] = useState(0);
  const darkBlueShades = ["#0078D4", "#005BA1", "#004578", "#003359"];
  const [selectedViz, setSelectedViz] = useState(null);
  const [show3DOption, setShow3DOption] = useState(false);
  const [showPieOption, setShowPieOption] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % darkBlueShades.length);
      setCurrentColor(darkBlueShades[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  const handleVizSelect = (vizType) => {
    if (vizType === "3D") {
      const confirm3D = window.confirm("Do you want to include 3D visualizations? Note: This requires additional libraries like Three.js for full implementation.");
      if (confirm3D) {
        setSelectedViz("3D");
      } else {
        setSelectedViz(null);
      }
      setShow3DOption(true);
    } else if (vizType === "Pie") {
      const confirmPie = window.confirm("Do you want to include Pie Charts?");
      if (confirmPie) {
        setSelectedViz("Pie");
      } else {
        setSelectedViz(null);
      }
      setShowPieOption(true);
    } else {
      setSelectedViz(vizType);
    }
  };

  const renderVisualization = () => {
    switch (selectedViz) {
      case "Line":
        return (
          <div className="chart-box">
            <h4 className="chart-title">Sales Trend</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#0078D4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "Bar":
        return (
          <div className="chart-box">
            <h4 className="chart-title">Product Sales</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#666", angle: -45, textAnchor: "end" }} interval={0} height={70} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Bar dataKey="sales" fill="#005BA1" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "Scatter":
        return (
          <div className="chart-box">
            <h4 className="chart-title">Forecast Accuracy</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis type="number" dataKey="x" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Scatter data={scatterData} fill="#FF6F61" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
      case "Area":
        return (
          <div className="chart-box">
            <h4 className="chart-title">Revenue Growth</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
                <YAxis tick={{ fontSize: 12, fill: "#666" }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" fill="rgba(0, 120, 212, 0.3)" stroke="#0078D4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
      case "Pie":
        return (
          <div className="chart-box full-width">
            <h4 className="chart-title">Category Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case "3D":
        return (
          <div className="chart-box full-width">
            <h4 className="chart-title">3D Visualization (Placeholder)</h4>
            <p>3D plots require additional libraries like Three.js or react-three-fiber for implementation. Contact your developer to integrate.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      {/* KPI Cards */}
      <div className="kpi-container">
        {[87, 46, -4, 86, 23, 65].map((percentage, idx) => (
          <div key={idx} className="kpi-card">
            <div className="kpi-header">
              <h4>Forecasted Data</h4>
              <span className="kpi-icon">📈</span>
            </div>
            <div className="kpi-value">
              <h2 style={{ color: percentage >= 0 ? "#00C853" : "#FF4444" }}>
                {percentage}%
              </h2>
              <p>{Math.floor(Math.random() * 500000000).toLocaleString()} Cases</p>
            </div>
            <div className="kpi-status">
              <span style={{ color: percentage >= 0 ? "#00C853" : "#FF4444" }}>
                {percentage >= 0 ? "On Target" : "Below Target"}
              </span>
              <div className="kpi-trend" style={{ background: percentage >= 0 ? "#E8F5E9" : "#FFEBEE" }}>
                <span>{percentage >= 0 ? "↑" : "↓"} {Math.abs(percentage)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visualization Selection */}
      <div className="viz-selection">
        <h3 className="viz-title">Select Visualization</h3>
        <div className="viz-options">
          <button onClick={() => handleVizSelect("Line")}>Line Graph</button>
          <button onClick={() => handleVizSelect("Bar")}>Bar Graph</button>
          <button onClick={() => handleVizSelect("Scatter")}>Scatter Plot</button>
          <button onClick={() => handleVizSelect("Area")}>Area Chart</button>
          <button onClick={() => handleVizSelect("Pie")}>Pie Chart</button>
          <button onClick={() => handleVizSelect("3D")}>3D Visualization</button>
        </div>
      </div>

      {/* Render Selected Visualization */}
      {renderVisualization()}
    </div>
  );
}

export default Dashboard;
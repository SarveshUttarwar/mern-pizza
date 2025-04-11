import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import "../App.css"; // Import global styles

function Dashboard() {
  // Dummy data for graphs
  const lineData = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 120 },
    { name: "Mar", value: 150 },
    { name: "Apr", value: 130 },
    { name: "May", value: 180 },
    { name: "Jun", value: 200 },
    { name: "Jul", value: 400 },
    { name: "Aug", value: 250 },
    { name: "sep", value: 190 },
    { name: "oct", value: 400 },
    { name: "nov", value: 175 },
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
  const COLORS = ["#002855", "#00509E", "#007BFF", "#1A1F71", "#00BFFF", "#4682B4", "#274472", "#0A1172"];



  const darkBlueShades = ["#002855", "#003F7D", "#00509E", "#007BFF"];
  const [currentColor, setCurrentColor] = useState(darkBlueShades[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % darkBlueShades.length);
      setCurrentColor(darkBlueShades[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* KPI Cards */}
      <div className="kpi-container">
        {[87, 46, -4, 86].map((percentage, idx) => (
          <div
            key={idx}
            className="kpi-card"
            style={{
              backgroundColor: currentColor,
              color: "white",
              transition: "background-color 1.5s ease-in-out",
            }}
          >
            <h4>Forecasted Data</h4>
            <h2 style={{ color: percentage >= 0 ? "#28FFBF" : "#FF4D4D", fontSize: "20px" }}>
              {percentage}%
            </h2>
            <p style={{ fontSize: "14px" }}>{Math.floor(Math.random() * 500000000)} Cases</p>
            <span style={{ fontSize: "12px" }}>
              {percentage >= 0 ? "On Target" : "Below Target"}
            </span>
          </div>
        ))}
      </div>

      {/* Graph Containers */}
      <div className="charts-container">
        {/* First Row - 2 Bigger Graphs */}
        <div className="large-graphs">
          <div className="graph-box">
            <h4 style={{ fontSize: "14px", color: "#002855" }}>Sales Trend</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <Line type="monotone" dataKey="value" stroke="#007BFF" strokeWidth={3} dot={{ stroke: "#002855", strokeWidth: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-box">
            <h4 style={{ fontSize: "14px", color: "#002855" }}>Product Sales</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <Bar dataKey="sales" fill="#00509E" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Second Row - 2 Bigger Graphs */}
        <div className="large-graphs">
          <div className="graph-box">
            <h4 style={{ fontSize: "14px", color: "#002855" }}>Forecast Accuracy</h4>
            <ResponsiveContainer width="90%" height={250}>
              <ScatterChart>
                <XAxis type="number" dataKey="x" tick={{ fontSize: 14 }} />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 14 }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <Scatter data={scatterData} fill="#FF4D4D" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="graph-box">
            <h4 style={{ fontSize: "16px", color: "#002855" }}>Revenue Growth</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={areaData}>
                <XAxis dataKey="month" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                <Area type="monotone" dataKey="revenue" fill="rgba(0, 40, 85, 0.7)" stroke="#002855" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Third Row - Pie Chart */}
        <div className="graph-box">
          <h4 style={{ fontSize: "16px", color: "#002855" }}>Category Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

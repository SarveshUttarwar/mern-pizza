import React, { useState } from "react";

// Initial People Data
const initialPeople = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", department: "HR", role: "Manager", empId: "12301001" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", department: "IT", role: "Operator", empId: "12302002" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", department: "Sales", role: "Manager", empId: "12303003" },
  { id: 4, name: "David Lee", email: "david@example.com", department: "HR", role: "Operator", empId: "12301004" },
  { id: 5, name: "Emma Wilson", email: "emma@example.com", department: "IT", role: "Manager", empId: "12302005" },
];

// List of Departments (9 Departments)
const departments = ["HR", "IT", "Sales", "Marketing", "Finance", "Logistics", "R&D", "Customer Support", "Operations"];
const roles = ["Manager", "Operator"];

// Mapping Departments to Warehouse IDs (2-Digit Code)
const warehouseIds = {
  HR: "01",
  IT: "02",
  Sales: "03",
  Marketing: "04",
  Finance: "05",
  Logistics: "06",
  "R&D": "07",
  "Customer Support": "08",
  Operations: "09",
};

const IAMPage = () => {
  const [people, setPeople] = useState(initialPeople);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDepartment, setNewDepartment] = useState(departments[0]);
  const [newRole, setNewRole] = useState(roles[0]);
  const [customEmpNum, setCustomEmpNum] = useState(""); // User enters last 3 digits

  // Function to Generate Employee ID
  const generateEmployeeId = (department, empNum) => {
    const orgId = "123"; // Fixed Organization ID
    const warehouseId = warehouseIds[department] || "00"; // Get Warehouse ID from Mapping
    const empNumber = empNum.padStart(3, "0"); // Ensure 3 Digits
    return `${orgId}${warehouseId}${empNumber}`;
  };

  // Function to Add a New Person
  const handleAddPerson = () => {
    if (newName && newEmail && customEmpNum.length === 3) {
      const newPerson = {
        id: people.length + 1,
        name: newName,
        email: newEmail,
        department: newDepartment,
        role: newRole,
        empId: generateEmployeeId(newDepartment, customEmpNum),
      };
      setPeople([...people, newPerson]);
      setNewName("");
      setNewEmail("");
      setCustomEmpNum(""); // Reset input field after adding
    } else {
      alert("Please enter a valid 3-digit Employee Number.");
    }
  };

  // Function to Get Role Counts for Each Department
  const getRoleCounts = (dept) => {
    return {
      managers: people.filter((p) => p.department === dept && p.role === "Manager").length,
      operators: people.filter((p) => p.department === dept && p.role === "Operator").length,
    };
  };

  return (
    <div className="container">
      {/* Page Title */}
      <h1 className="page-title">IAM - Identity and Access Management</h1>

      {/* People Management Section */}
      <div className="card">
        <h2 className="card-title">👥 People Management</h2>

        {/* Add Person Form */}
        <div className="form-section">
          <h3 className="form-title">➕ Add New Person</h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              className="input-field"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <select className="input-field" value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)}>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select className="input-field" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Last 3 Digits of Employee ID"
              className="input-field"
              value={customEmpNum}
              maxLength="3"
              onChange={(e) => setCustomEmpNum(e.target.value.replace(/\D/, ""))} // Allow only numbers
            />
          </div>
          <button className="add-button" onClick={handleAddPerson}>
            Add Person
          </button>
        </div>

        {/* People List */}
        <div className="table-container">
          <h3 className="section-title">📋 Employee List</h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Role</th>
                <th>Employee ID</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>{person.department}</td>
                  <td className="role-cell">{person.role}</td>
                  <td className="emp-id">{person.empId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Overview with Analytics */}
      <div className="card">
        <h2 className="card-title">🏢 Department Overview</h2>
        <div className="department-grid">
          {departments.map((dept, index) => {
            const { managers, operators } = getRoleCounts(dept);
            return (
              <div key={index} className="department-card">
                <h3>{dept}</h3>
                <p>✅ <b>{people.filter((p) => p.department === dept).length}</b> Employees</p>
                <p>👔 <b>{managers}</b> Managers</p>
                <p>⚙️ <b>{operators}</b> Operators</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IAMPage;
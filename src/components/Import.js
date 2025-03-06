import React, { useState, useRef } from "react";
import "../App.css"; // Import global styles

function ImportData() {
  const [selectedTable, setSelectedTable] = useState("");
  const [importLog, setImportLog] = useState("");
  const fileInputRef = useRef(null);

  // Dropdown options
  const dataTableOptions = [
    "Product",
    "Location",
    "Customer",
    "Product Location",
    "Product Customer",
  ];

  // Logs based on selection
  const logMessages = {
    Customer: "Customer: 100/100 rows successfully loaded",
    Product:
      "Product: 99/100 rows successfully loaded (1 row rejected: Value for the field PRDCODE exceeds the limit)",
    "Product Location":
      "LocationProduct: Upload failed (Reason: Error in table structure / Wrong template)",
  };

  // Handle dropdown selection
  const handleSelectionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedTable(selectedValue);
    setImportLog(logMessages[selectedValue] || "");
  };

  // Handle file import button click
  const handleImportClick = () => {
    fileInputRef.current.click(); // Open file explorer
  };

  // Handle file selection
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      alert(`Selected file: ${event.target.files[0].name}`);
    }
  };

  // Simulate file download
  const handleDownloadClick = () => {
    const element = document.createElement("a");
    const file = new Blob(["Template data"], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "Template.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="import-data-container">
      {/* Action Buttons */}
      <div className="import-actions">
        <button className="action-btn">Data Import Methodology</button>
        <button className="action-btn">Run Interface</button>
        <select className="action-btn dropdown">
          <option>Import CSV</option>
        </select>
      </div>

      {/* Template Section */}
      <div className="template-container">
        {/* Download Template */}
        <div className="template-card">
          <h3 className="template-title">Download Template</h3>
          <div className="template-content">
            <label>Data Table</label>
            <select className="input-field" onChange={handleSelectionChange}>
              <option value="">Select...</option>
              {dataTableOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label>Download To</label>
            <select className="input-field">
              <option>Select...</option>
            </select>

            {/* Buttons */}
            <div className="btn-group">
              <button className="cancel-btn">Cancel</button>
              <button className="save-btn" onClick={handleDownloadClick}>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Upload Template */}
        <div className="template-card">
          <h3 className="template-title">Upload Template</h3>
          <div className="template-content">
            <label>Data Table</label>
            <select className="input-field" onChange={handleSelectionChange}>
              <option value="">Select...</option>
              {dataTableOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <label>Import To</label>
            <select className="input-field">
              <option>Select...</option>
            </select>

            {/* Buttons */}
            <div className="btn-group">
              <button className="cancel-btn">Cancel</button>
              <button className="save-btn" onClick={handleImportClick}>
                Import
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Import Log Section */}
      <div className="import-log">
        <h3>Import log</h3>
        <p>{importLog}</p>
      </div>
    </div>
  );
}

export default ImportData;

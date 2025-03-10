import React, { useState, useRef } from "react";
import Papa from "papaparse"; // CSV Parser
import "../App.css"; // Import global styles

function ImportData() {
  const [selectedTable, setSelectedTable] = useState("");
  const [downloadTo, setDownloadTo] = useState("");
  const [importLog, setImportLog] = useState("");
  const [importedData, setImportedData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [columnMappings, setColumnMappings] = useState({});
  const [timeDependentVariables, setTimeDependentVariables] = useState([]);
  const fileInputRef = useRef(null);

  const mandatoryFields = ["OrderDate", "QtyOrdered"]; // Required fields

  const logMessages = {
    Customer: "Customer: 100/100 rows successfully loaded",
    Product:
      "Product: 99/100 rows successfully loaded (1 row rejected: Value for PRDCODE exceeds the limit)",
    "Product Location":
      "LocationProduct: Upload failed (Reason: Error in table structure / Wrong template)",
  };

  const tableTemplates = {
    Product: ["ProductID", "ProductName", "Category", "Price"],
    Location: ["LocationID", "LocationName", "Address", "City"],
    Customer: ["CustomerID", "CustomerName", "Email", "Phone"],
    "Product Location": ["ProductID", "LocationID", "Stock"],
    "Product Customer": ["ProductID", "CustomerID", "PurchaseDate"],
  };

  const handleSelectionChange = (event) => {
    setSelectedTable(event.target.value);
    setImportLog(logMessages[event.target.value] || "");
  };

  const handleDownloadChange = (event) => {
    setDownloadTo(event.target.value);
  };

  const handleDownloadTemplate = () => {
    if (!selectedTable) {
      alert("Please select a Data Table.");
      return;
    }
    if (!downloadTo || downloadTo === "Select...") {
      alert("Please select where to download.");
      return;
    }

    const headers = tableTemplates[selectedTable] || [];
    const csvContent = [headers.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${selectedTable}_Template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result) => {
        if (result.data.length > 0) {
          const headers = result.data[0];
          const rows = result.data.slice(1).map((row) =>
            headers.reduce((acc, header, index) => {
              acc[header] = row[index] || "";
              return acc;
            }, {})
          );

          setColumnNames(headers);
          setImportedData(rows);
          setShowColumns(true);
          setShowTable(false);
        }
      },
      header: false,
      skipEmptyLines: true,
    });

    alert(`Selected file: ${file.name}`);
  };

  const handleDeleteColumn = (column) => {
    const updatedColumns = columnNames.filter((col) => col !== column);
    const updatedData = importedData.map((row) => {
      const newRow = { ...row };
      delete newRow[column];
      return newRow;
    });
    setColumnNames(updatedColumns);
    setImportedData(updatedData);
  };

  const handleMappingChange = (mandatoryField, selectedColumn) => {
    setColumnMappings({
      ...columnMappings,
      [mandatoryField]: selectedColumn,
    });
  };

  const handleShowPreview = () => {
    setShowTable(true);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedData = [...importedData];
    updatedData[index][field] = value;
    setImportedData(updatedData);
  };

  const handleTimeDependentVariablesChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setTimeDependentVariables(selectedOptions);
  };

  const handleFinalUpload = () => {
    const missingFields = mandatoryFields.filter(
      (field) => !columnMappings[field]
    );

    if (missingFields.length > 0) {
      alert(
        `Error: Please map the following mandatory fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    // Apply mappings to column names
    const mappedColumnNames = columnNames.map((col) => {
      const mappedField = Object.entries(columnMappings).find(
        ([_, value]) => value === col
      );
      return mappedField ? mappedField[0] : col;
    });

    alert(
      `Fields uploaded successfully: ${mappedColumnNames.join(", ")}\n` +
        `Time-dependent variables: ${timeDependentVariables.join(", ")}`
    );
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
              <option value="Product">Product</option>
              <option value="Location">Location</option>
              <option value="Customer">Customer</option>
              <option value="Product Location">Product Location</option>
              <option value="Product Customer">Product Customer</option>
            </select>

            <label>Download To</label>
            <select className="input-field" onChange={handleDownloadChange}>
              <option>Select...</option>
              <option value="Local">Local</option>
            </select>

            <div className="btn-group">
              <button className="cancel-btn">Cancel</button>
              <button className="save-btn" onClick={handleDownloadTemplate}>
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Upload Template */}
        <div className="template-card">
          <h3 className="template-title">Upload Data</h3>
          <div className="template-content">
            <label>Import Datatype</label>
            <select className="input-field">
              <option>Sales</option>
            </select>

            <label>Import from</label>
            <select className="input-field">
              <option>Local device</option>
              <option>Online</option>
            </select>

            <div className="btn-group">
              <button className="cancel-btn">Cancel</button>
              <button className="save-btn" onClick={handleImportClick}>
                Import
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept=".csv"
            />
          </div>
        </div>
      </div>

      {/* Import Log Section */}
      <div className="import-log">
        <h3>Import log</h3>
        <p>{importLog}</p>
      </div>

      {/* Mandatory Fields Notification */}
      <div className="mandatory-fields">
        <h4>Mandatory Fields (Cannot be Skipped):</h4>
        <ul>
          {mandatoryFields.map((field, index) => (
            <li key={index} className="mandatory-field">
              {field} <span className="asterisk">*</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Column Selection and Mapping */}
      {showColumns && (
        <div className="column-selection">
          <h3>Select and Map Columns</h3>

          {/* Available Columns Section */}
          <div className="available-columns">
            <h4>Available Columns:</h4>
            <div className="columns-container">
              {columnNames.map((col, index) => (
                <div key={index} className="column-item">
                  {col}
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteColumn(col)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Field Mapping */}
          <div className="mapping-section">
            <h4>Map Mandatory Fields:</h4>
            <div className="mapping-container">
              {mandatoryFields.map((field) => (
                <div key={field} className="mapping-item">
                  <label>{field}:</label>
                  <select
                    className="mapping-dropdown"
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                    value={columnMappings[field] || ""}
                  >
                    <option value="">Select column...</option>
                    {columnNames.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Time-dependent variables selection */}
          <div className="time-dependent-variables">
            <h4>Select additional time-dependent variables:</h4>
            <select
              multiple
              className="input-field"
              onChange={handleTimeDependentVariablesChange}
            >
              {columnNames.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Show Preview Button */}
          <button className="save-btn" onClick={handleShowPreview}>
            Show Preview
          </button>
        </div>
      )}

      {/* Data Table Display */}
      {showTable && importedData.length > 0 && (
        <div className="imported-data-table">
          <h3>Preview First 5 Rows</h3>
          <table>
            <thead>
              <tr>
                {columnNames.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {importedData.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {columnNames.map((col, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        value={row[col] || ""}
                        onChange={(e) =>
                          handleFieldChange(index, col, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button className="save-btn" onClick={handleFinalUpload}>
            Upload Data
          </button>
        </div>
      )}
    </div>
  );
}

export default ImportData;
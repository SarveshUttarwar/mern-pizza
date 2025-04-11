import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { UPLOAD_CLEANED_DATA_ENDPOINT } from './config';
import "../App.css";

const ForecastSettings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [timeBucket, setTimeBucket] = useState("Daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [forecastHorizon, setForecastHorizon] = useState("10");
  const [forecastLock, setForecastLock] = useState("19");
  const [measures, setMeasures] = useState([{ id: Date.now(), value: "Sales History", selected: false }]);
  const [granularity, setGranularity] = useState("Overall"); // Updated default to new option
  const [aggregation, setAggregation] = useState("Sum");
  const [forecastMethod, setForecastMethod] = useState("Best Fit");
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [canRunModel, setCanRunModel] = useState(false);

  const [uploadedDatasets, setUploadedDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [importedData, setImportedData] = useState([]);
  const [columnNames, setColumnNames] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [columnMappings, setColumnMappings] = useState({});
  const [timeDependentVariables, setTimeDependentVariables] = useState([]);
  const columnSelectionRef = useRef(null);
  const uploadButtonRef = useRef(null);

  const mandatoryFields = ["Date", "Demand", "StoreID", "ProductID"];

  const models = [
    { name: "Seasonal History", createdBy: "Arjun", date: "7-Nov-2024" },
    { name: "Intermittent History", createdBy: "Bhavana", date: "7-Nov-2024" },
    { name: "Advanced Forecasting", createdBy: "Vishnu", date: "7-Nov-2024" },
  ];

  const measureOptions = ["Sales History", "Inventory Levels", "Demand Trends"];

  // New granularity options
  const granularityOptions = [
    "Overall",
    "ProductID-wise",
    "StoreID-ProductID Combination",
  ];

  // Fetch files from the server
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://192.168.60.68:8080/files");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch file list: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setUploadedDatasets(data.files || []);
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Error fetching files. Please try again.");
      }
    };
    fetchFiles();
  }, []);

  // Parse selected dataset
  const handleDatasetChange = async (event) => {
    const fileName = event.target.value;
    setSelectedDataset(fileName);
    setImportedData([]);
    setColumnNames([]);
    setShowColumns(false);
    setShowTable(false);
    setColumnMappings({});
    setTimeDependentVariables([]);

    if (fileName) {
      try {
        const response = await fetch(`http://192.168.60.68:8080/download/${encodeURIComponent(fileName)}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Fetch failed with status ${response.status}: ${errorText}`);
        }

        const fileType = fileName.split(".").pop().toLowerCase();
        if (fileType === "csv") {
          const text = await response.text();
          Papa.parse(text, {
            complete: (result) => {
              if (result.data && result.data.length > 0) {
                const headers = result.data.length > 1 && typeof result.data[0] === "object"
                  ? Object.keys(result.data[0] || {})
                  : result.data[0] || [];
                const rows = result.data.slice(1).filter(row => row && Object.keys(row).length > 0);
                setColumnNames(Array.isArray(headers) ? headers : [headers]);
                setImportedData(rows);
                setShowColumns(true);
                setTimeout(() => {
                  if (columnSelectionRef.current) {
                    columnSelectionRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }, 100);
              } else {
                alert("No data or headers found in the selected CSV file.");
              }
            },
            header: true,
            skipEmptyLines: true,
            error: (error) => {
              throw new Error(`Error parsing CSV: ${error.message}`);
            },
          });
        } else if (fileType === "xlsx" || fileType === "xls") {
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          if (jsonData.length > 0) {
            const headers = jsonData[0] || [];
            const rows = jsonData.slice(1).filter(row => row && row.length > 0);
            setColumnNames(Array.isArray(headers) ? headers : [headers]);
            setImportedData(rows);
            setShowColumns(true);
            setTimeout(() => {
              if (columnSelectionRef.current) {
                columnSelectionRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 100);
          } else {
            alert("No data or headers found in the selected Excel file.");
          }
        }
      } catch (error) {
        console.error("Full preview error:", error);
        alert(`Error previewing file: ${error.message}`);
      }
    }
  };

  const handleDeleteColumn = (column) => {
    if (!Array.isArray(columnNames) || !columnNames.includes(column)) return;
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

  const areMandatoryFieldsMapped = () => {
    return mandatoryFields.every(field =>
      columnMappings[field] && columnNames.includes(columnMappings[field])
    );
  };

  const handleShowPreview = () => {
    if (areMandatoryFieldsMapped()) {
      setShowTable(true);
    } else {
      alert("Please map the fields first");
    }
  };

  const handleFieldChange = (index, field, value) => {
    const updatedData = [...importedData];
    updatedData[index][field] = value;
    setImportedData(updatedData);
  };

  const handleTimeDependentVariablesChange = (event) => {
    const { value, checked } = event.target;
    setTimeDependentVariables((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
    if (checked && uploadButtonRef.current) {
      uploadButtonRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearTimeDependentVariables = () => {
    setTimeDependentVariables([]);
  };

  const handleUploadDataForCleaning = async () => {
    if (!areMandatoryFieldsMapped()) {
      alert("Please map all mandatory fields before uploading.");
      return;
    }

    const finalData = importedData.map(row => {
      const cleanedRow = {};
      mandatoryFields.forEach(field => {
        if (columnMappings[field]) {
          cleanedRow[field] = row[columnMappings[field]];
        }
      });
      timeDependentVariables.forEach(varName => {
        if (row[varName] !== undefined) {
          cleanedRow[varName] = row[varName];
        }
      });
      return cleanedRow;
    });

    const csv = Papa.unparse(finalData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const formData = new FormData();
    const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
    const newFilename = `${selectedDataset.split('.')[0]}_cleaned_${timestamp}.csv`;
    formData.append("file", blob, newFilename);

    try {
      const response = await fetch(UPLOAD_CLEANED_DATA_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      alert(`New CSV file '${newFilename}' created successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Error uploading data: ${error.message}`);
    }
  };

  // Forecast Settings Functions
  const addMeasure = () => {
    setMeasures([...measures, { id: Date.now(), value: "Sales History", selected: false }]);
    setShowCheckboxes(false);
  };

  const removeMeasure = () => {
    if (!showCheckboxes) {
      setShowCheckboxes(true);
    } else {
      const remainingMeasures = measures.filter((measure) => !measure.selected);
      setMeasures(remainingMeasures);
      setShowCheckboxes(remainingMeasures.length > 0);
    }
  };

  const resetForm = () => {
    setTimeBucket("Daily");
    setStartDate("");
    setEndDate("");
    setForecastHorizon("0");
    setForecastLock("0");
    setMeasures([{ id: Date.now(), value: "Sales History", selected: false }]);
    setGranularity("Overall");
    setAggregation("Sum");
    setForecastMethod("Best Fit");
    setShowCheckboxes(false);
    setSelectedDataset("");
    setImportedData([]);
    setColumnNames([]);
    setShowColumns(false);
    setShowTable(false);
    setColumnMappings({});
    setTimeDependentVariables([]);
  };

  const handleRunModel = () => {
    const config = {
      model: selectedModel,
      timeSettings: { bucket: timeBucket, start: startDate, end: endDate },
      forecastParams: { horizon: forecastHorizon, lockPeriod: forecastLock },
      measures: measures.map((m) => m.value),
      dataset: selectedDataset,
      granularity: granularity,
    };
    console.log("Running model with config:", config);
    alert(`Model ${selectedModel} execution started with dataset ${selectedDataset}! Check console for details.`);
  };

  const handleCheckboxChange = (id) => {
    setMeasures(
      measures.map((measure) =>
        measure.id === id ? { ...measure, selected: !measure.selected } : measure
      )
    );
  };

  useEffect(() => {
    const requiredFilled =
      selectedModel && startDate && endDate && forecastHorizon && forecastLock && measures.length > 0 && selectedDataset;
    setCanRunModel(requiredFilled);
  }, [selectedModel, startDate, endDate, forecastHorizon, forecastLock, measures, selectedDataset]);

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">Forecast Settings</h3>

      {/* Dataset Selection Dropdown */}
      <div className="forecast-details" style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "18px" }}><strong>Available Datasets :</strong></label>
        <select
          value={selectedDataset}
          onChange={handleDatasetChange}
          className="input-field"
          disabled={uploadedDatasets.length === 0}
        >
          <option value="">Select a Dataset</option>
          {uploadedDatasets.map((dataset, index) => (
            <option key={index} value={dataset}>{dataset}</option>
          ))}
        </select>
        {uploadedDatasets.length === 0 && (
          <p style={{ color: "#DC3545", fontSize: "14px", marginTop: "5px" }}>
            No datasets uploaded. Please upload data in the Import section.
          </p>
        )}
      </div>

      {/* Column Selection and Mapping */}
      {showColumns && Array.isArray(columnNames) && columnNames.length > 0 && (
        <div ref={columnSelectionRef} className="column-selection">
          <h3>Select and Map Columns</h3>

          <div className="available-columns">
            <h4>Available Columns:</h4>
            <div className="columns-container">
              {columnNames.map((col, index) => (
                <div key={index} className="column-item">
                  {col}
                  <button className="delete-btn" onClick={() => handleDeleteColumn(col)}>
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

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
                    {Array.isArray(columnNames) && columnNames.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div className="time-dependent-variables">
            <h4>Select Additional Time-Dependent Variables:</h4>
            <div className="checkbox-container">
              {Array.isArray(columnNames) && columnNames.map((col) => (
                <label key={col} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={col}
                    checked={timeDependentVariables.includes(col)}
                    onChange={handleTimeDependentVariablesChange}
                  />
                  {col}
                </label>
              ))}
            </div>
            <button className="clear-btn" onClick={handleClearTimeDependentVariables}>
              Clear Selection
            </button>
            <button
              className={`preview-btn ${!areMandatoryFieldsMapped() ? "disabled" : ""}`}
              onClick={handleShowPreview}
              style={{ marginLeft: "20px" }}
            >
              Show Preview
            </button>
          </div>
        </div>
      )}

      {/* Preview Table */}
      {showTable && Array.isArray(importedData) && importedData.length > 0 && Array.isArray(columnNames) && columnNames.length > 0 && (
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
                        onChange={(e) => handleFieldChange(index, col, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button ref={uploadButtonRef} className="save-btn" onClick={handleUploadDataForCleaning}>
            Upload Data for Cleaning
          </button>
        </div>
      )}

      {/* Granularity Dropdown (Moved Here) */}
      {showTable && (
        <div className="granularity-section" style={{ marginTop: "20px" }}>
          <h4 style={{ fontSize: "18px" }}><strong>Granularity :</strong></h4>
          <div className="dropdown-container">
            <select
              value={granularity}
              onChange={(e) => setGranularity(e.target.value)}
              className="centered-dropdown"
            >
              {granularityOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Model Selection */}
      <div className="forecast-details">
        <label style={{ fontSize: "18px" }}><strong>Model Name :</strong></label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          <option value="">Select a Model</option>
          {models.map((model, index) => (
            <option key={index} value={model.name}>{model.name}</option>
          ))}
        </select>
      </div>

      {selectedModel && (
        <>
          <div className="top-buttons">
            <button className="reset-button" onClick={resetForm}>Reset</button>
          </div>
          <div className="time-settings">
            <h4 style={{ fontSize: "18px" }}><strong>Time Settings :</strong></h4>
            <div className="settings-card-group" style={{ display: "flex", gap: "10px" }}>
              <div className="settings-card" style={{ flex: "0.9" }}>
                <h5 style={{ fontSize: "16px" }}>Time Bucket</h5>
                <div className="input-group">
                  <select style={{ width: "120px" }} value={timeBucket} onChange={(e) => setTimeBucket(e.target.value)}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="settings-card" style={{ flex: "1" }}>
                <h5 style={{ fontSize: "16px" }}>Historical Horizon</h5>
                <div className="input-group">
                  <label>Start Date:</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>End Date:</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="settings-card">
                <h5 style={{ fontSize: "16px" }}>Forecast Parameters</h5>
                <div className="input-group">
                  <label>Forecast Horizon:</label>
                  <input type="number" value={forecastHorizon} onChange={(e) => setForecastHorizon(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Forecast Lock Period:</label>
                  <input type="number" value={forecastLock} onChange={(e) => setForecastLock(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="forecast-parameters active">
            <h4 style={{ fontSize: "18px" }}><strong>Forecast Parameters :</strong></h4>
            <div className="forecast-methodology">
              <div className="dropdown-container">
                <label style={{ fontSize: "16px" }}><strong>Aggregation Level: </strong></label>
                <select value={aggregation} onChange={(e) => setAggregation(e.target.value)} className="centered-dropdown">
                  <option value="Sum">Sum</option>
                  <option value="Average">Average</option>
                  <option value="Max">Max</option>
                </select>
              </div>

              <div className="dropdown-container">
                <label style={{ fontSize: "16px" }}><strong>Forecast Methodology: </strong></label>
                <select value={forecastMethod} onChange={(e) => setForecastMethod(e.target.value)} className="centered-dropdown">
                  <option value="Best Fit">Best Fit</option>
                  <option value="Ensemble">Ensemble</option>
                  <option value="Select From List">Select From List</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input-data-section">
            <h4 style={{ fontSize: "18px" }}><strong>Input Data </strong></h4>
            <div className="measures-container">
              <label style={{ fontSize: "16px", fontWeight: "bold" }}>Measures:</label>
              <button className="add-button" onClick={addMeasure}>Add</button>
              <button className="remove-button" onClick={removeMeasure}>
                {showCheckboxes ? "Remove" : "Remove"}
              </button>
            </div>

            <div className="measures-dropdown-container">
              {measures.map((measure, index) => (
                <div key={measure.id} className="measure-row">
                  {showCheckboxes && (
                    <input
                      type="checkbox"
                      checked={measure.selected}
                      onChange={() => handleCheckboxChange(measure.id)}
                      className="measure-checkbox"
                    />
                  )}
                  <select
                    value={measure.value}
                    onChange={(e) => {
                      const newMeasures = [...measures];
                      newMeasures[index].value = e.target.value;
                      setMeasures(newMeasures);
                    }}
                    className="measures-dropdown"
                  >
                    {measureOptions.map((option, idx) => (
                      <option key={idx} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="run-model-card">
              <h4>Model Execution</h4>
              <button
                className={`run-button ${canRunModel ? "active" : "disabled"}`}
                onClick={handleRunModel}
                disabled={!canRunModel}
              >
                Run Forecasting Model
              </button>
              {!canRunModel && <p className="validation-message">Please fill all required parameters</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ForecastSettings;
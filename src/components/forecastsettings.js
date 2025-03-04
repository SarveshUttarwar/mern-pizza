import React, { useState } from "react";

const ForecastSettings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [timeBucket, setTimeBucket] = useState("Daily");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [forecastHorizon, setForecastHorizon] = useState("10");
    const [forecastLock, setForecastLock] = useState("19");
    const [measures, setMeasures] = useState(["Sales History"]);
    const [showForecastParams, setShowForecastParams] = useState(false);

    const [granularity, setGranularity] = useState("Product Code");
    const [aggregation, setAggregation] = useState("Sum");
    const [forecastMethod, setForecastMethod] = useState("Best Fit");

    const models = [
        { name: "Seasonal History", createdBy: "Arjun", date: "7-Nov-2024" },
        { name: "Intermittent History", createdBy: "Bhavana", date: "7-Nov-2024" },
        { name: "Advanced Forecasting", createdBy: "Vishnu", date: "7-Nov-2024" },
        { name: "Machine Learning Model A", createdBy: "Thejas", date: "6-Nov-2024" },
        { name: "Machine Learning Model B", createdBy: "Santosh", date: "5-Nov-2024" },
        { name: "Deep Learning Forecast", createdBy: "Satyam", date: "3-Nov-2024" },
        { name: "Bayesian Forecasting", createdBy: "Jaydatta", date: "2-Nov-2024" },
        { name: "Regression Analysis", createdBy: "Yashas", date: "1-Nov-2024" },
        { name: "ARIMA Model", createdBy: "Sarvesh", date: "30-Oct-2024" },
        { name: "Exponential Smoothing", createdBy: "Sreeram", date: "29-Oct-2024" },
    ];

    const measureOptions = ["Sales History", "Inventory Levels", "Demand Trends"];

    const addMeasure = () => setMeasures([...measures, "Sales History"]);
    const removeMeasure = () => measures.length > 1 && setMeasures(measures.slice(0, -1));

    return (
        <div className="forecast-container">
            <h3 className="forecast-title">Forecast Settings</h3>

            {/* Model Selection */}
            <div className="forecast-details">
                <label><strong>Model Name :</strong></label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    <option value="">Select a Model</option>
                    {models.map((model, index) => (
                        <option key={index} value={model.name}>{model.name}</option>
                    ))}
                </select>
            </div>

            {/* If a model is selected, show forecast settings */}
            {selectedModel && (
                <>
                    {/* Time Settings */}
                    <div className="time-settings">
                        <h4>Time Settings</h4>
                        <div className="settings-container">
                            <div className="settings-card">
                                <h5>Time Bucket</h5>
                                <select value={timeBucket} onChange={(e) => setTimeBucket(e.target.value)}>
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>

                            <div className="settings-card">
                                <h5>Historical Horizon</h5>
                                <label>Start Date:</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                <label>End Date:</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>

                            <div className="settings-card">
                                <h5>Forecast Parameters</h5>
                                <label><strong>Forecast Horizon:</strong></label>
                                <input 
                                    type="number" 
                                    value={forecastHorizon} 
                                    onChange={(e) => setForecastHorizon(e.target.value)} 
                                    className="forecast-input"
                                />

                                <label><strong>Forecast Lock Period:</strong></label>
                                <input 
                                    type="number" 
                                    value={forecastLock} 
                                    onChange={(e) => setForecastLock(e.target.value)} 
                                    className="forecast-input"
                                />

                                <button className="forecast-button" onClick={() => setShowForecastParams(!showForecastParams)}>
                                    Forecast Parameters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Forecast Parameters */}
                    {showForecastParams && (
                        <div className="forecast-parameters active">
                            <h4>Forecast Parameters</h4>

                            <div className="forecast-methodology">
                                <div className="dropdown-container">
                                    <label><strong>Granularity:</strong></label>
                                    <select value={granularity} onChange={(e) => setGranularity(e.target.value)}>
                                        <option value="Product Code">Product Code</option>
                                        <option value="Location Code">Location Code</option>
                                        <option value="Region Code">Region Code</option>
                                        <option value="Customer Country">Customer Country</option>
                                    </select>
                                </div>

                                <div className="dropdown-container">
                                    <label><strong>Aggregation Level:</strong></label>
                                    <select value={aggregation} onChange={(e) => setAggregation(e.target.value)}>
                                        <option value="Sum">Sum</option>
                                        <option value="Average">Average</option>
                                        <option value="Max">Max</option>
                                    </select>
                                </div>

                                <div className="dropdown-container">
                                    <label><strong>Forecast Methodology:</strong></label>
                                    <select value={forecastMethod} onChange={(e) => setForecastMethod(e.target.value)}>
                                        <option value="Best Fit">Best Fit</option>
                                        <option value="Ensemble">Ensemble</option>
                                        <option value="Select From List">Select From List</option>
                                    </select>
                                </div>
                            </div>

                            <div className="button-group">
                                <button className="save-button">Save</button>
                                <button className="cancel-button" onClick={() => setShowForecastParams(false)}>Cancel</button>
                            </div>
                        </div>
                    )}

                    {/* Input Data Section */}
                    <div className="input-data-section">
                        <h4>Input Data</h4>
                        <div className="measures-container">
                            <label>Measures:</label>
                            <button className="add-button" onClick={addMeasure}>Add</button>
                            <button className="remove-button" onClick={removeMeasure}>Remove</button>
                        </div>

                        <select className="measures-dropdown">
                            {measures.map((measure, index) => (
                                <option key={index} value={measure}>{measure}</option>
                            ))}
                        </select>
                    </div>
                </>
            )}

            {/* List of Models Created */}
            <h4>List of Models Created</h4>
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
            <table>
                <thead>
                    <tr>
                        <th>Model Name</th>
                        <th>Created By</th>
                        <th>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    {models.filter((model) => model.name.toLowerCase().includes(searchTerm.toLowerCase())).map((model, index) => (
                        <tr key={index}>
                            <td>{model.name}</td>
                            <td>{model.createdBy}</td>
                            <td>{model.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ForecastSettings;

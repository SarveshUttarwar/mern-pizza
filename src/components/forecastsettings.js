import React, { useState } from "react";

const ForecastSettings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [timeBucket, setTimeBucket] = useState("Daily");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [forecastHorizon, setForecastHorizon] = useState("10");
    const [forecastLock, setForecastLock] = useState("19");
    const [measures, setMeasures] = useState([{ id: Date.now(), value: "Sales History", selected: false }]);
    const [granularity, setGranularity] = useState("Product Code");
    const [aggregation, setAggregation] = useState("Sum");
    const [forecastMethod, setForecastMethod] = useState("Best Fit");
    const [showCheckboxes, setShowCheckboxes] = useState(false);

    const models = [
        { name: "Seasonal History", createdBy: "Arjun", date: "7-Nov-2024" },
        { name: "Intermittent History", createdBy: "Bhavana", date: "7-Nov-2024" },
        { name: "Advanced Forecasting", createdBy: "Vishnu", date: "7-Nov-2024" },
    ];

    const measureOptions = ["Sales History", "Inventory Levels", "Demand Trends"];

    const addMeasure = () => {
        setMeasures([...measures, { id: Date.now(), value: "Sales History", selected: false }]);
        setShowCheckboxes(false);
    };

    const removeMeasure = () => {
        if (!showCheckboxes) {
            setShowCheckboxes(true);
        } else {
            const remainingMeasures = measures.filter(measure => !measure.selected);
            setMeasures(remainingMeasures);
            setShowCheckboxes(remainingMeasures.length > 0);
        }
    };

    const handleCheckboxChange = (id) => {
        setMeasures(measures.map(measure =>
            measure.id === id ? { ...measure, selected: !measure.selected } : measure
        ));
    };

    return (
        <div className="forecast-container">
            <h3 className="forecast-title">Forecast Settings</h3>

            <div className="forecast-details">
                <label><strong>Model Name :</strong></label>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                    <option value="">Select a Model</option>
                    {models.map((model, index) => (
                        <option key={index} value={model.name}>{model.name}</option>
                    ))}
                </select>
            </div>

            {selectedModel && (
                <>
                    <div className="time-settings">
                        <h4>Time Settings</h4>
                        <div className="settings-card-group" style={{ display: "flex", gap: "10px" }}>
                            <div className="settings-card" style={{ flex: "0.9" }}>
                                <h5>Time Bucket</h5>
                                <div className="input-group">
                                    <select style={{ width: "120px" }} value={timeBucket} onChange={(e) => setTimeBucket(e.target.value)}>
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="settings-card" style={{ flex: "1" }}>
                                <h5>Historical Horizon</h5>
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
                                <h5>Forecast Parameters</h5>
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
                    </div>

                    <div className="input-data-section">
                        <h4>Input Data</h4>
                        <div className="measures-container">
                            <label>Measures:</label>
                            <button className="add-button" onClick={addMeasure}>Add</button>
                            <button className="remove-button" onClick={removeMeasure}>
                                {showCheckboxes ? 'Confirm Remove' : 'Remove'}
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
                    </div>
                </>
            )}
        </div>
    );
};

export default ForecastSettings;

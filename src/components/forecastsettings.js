import React, { useState, useEffect } from "react";

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
    const [canRunModel, setCanRunModel] = useState(false);

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

    const resetForm = () => {

        setTimeBucket("Daily");
        setStartDate("");
        setEndDate("");
        setForecastHorizon("0");
        setForecastLock("0");
        setMeasures([{ id: Date.now(), value: "Sales History", selected: false }]);
        setGranularity("Product Code");
        setAggregation("Sum");
        setForecastMethod("Best Fit");
        setShowCheckboxes(false);
    };


    const handleRunModel = () => {
        const config = {
            model: selectedModel,
            timeSettings: {
                bucket: timeBucket,
                start: startDate,
                end: endDate
            },
            forecastParams: {
                horizon: forecastHorizon,
                lockPeriod: forecastLock
            },
            measures: measures.map(m => m.value)
        };

        console.log("Running model with config:", config);
        alert(`Model ${selectedModel} execution started! Check console for details.`);
    };

    const handleCheckboxChange = (id) => {
        setMeasures(measures.map(measure =>
            measure.id === id ? { ...measure, selected: !measure.selected } : measure
        ));
    };

    useEffect(() => {
        const requiredFilled = selectedModel &&
            startDate &&
            endDate &&
            forecastHorizon &&
            forecastLock &&
            measures.length > 0;
        setCanRunModel(requiredFilled);
    }, [selectedModel, startDate, endDate, forecastHorizon, forecastLock, measures]);

    return (

        <div className="forecast-container">
            <h3 className="forecast-title">Forecast Settings</h3>

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
                                <label style={{ fontSize: "16px" }}><strong>Granularity:  </strong></label>
                                <select value={granularity} onChange={(e) => setGranularity(e.target.value)} style={{ textAlign: "center", textAlignLast: "center" }}>
                                    <option value="Product Code">Product Code</option>
                                    <option value="Location Code">Location Code</option>
                                    <option value="Region Code">Region Code</option>
                                    <option value="Customer Country">Customer Country</option>
                                </select>
                            </div>

                            <div className="dropdown-container">
                                <label style={{ fontSize: "16px" }}><strong>Aggregation Level:  </strong></label>
                                <select value={aggregation} onChange={(e) => setAggregation(e.target.value)} style={{ textAlign: "center", textAlignLast: "center" }}>
                                    <option value="Sum">Sum</option>
                                    <option value="Average">Average</option>
                                    <option value="Max">Max</option>
                                </select>
                            </div>

                            <div className="dropdown-container">
                                <label style={{ fontSize: "16px" }}><strong>Forecast Methodology: </strong></label>
                                <select value={forecastMethod} onChange={(e) => setForecastMethod(e.target.value)} style={{ textAlign: "center", textAlignLast: "center" }}>
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
                                {showCheckboxes ? 'Remove' : 'Remove'}
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
                                className={`run-button ${canRunModel ? 'active' : 'disabled'}`}
                                onClick={handleRunModel}
                                disabled={!canRunModel}
                            >
                                Run Forecasting Model
                            </button>
                            {!canRunModel && (
                                <p className="validation-message">Please fill all required parameters</p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ForecastSettings;

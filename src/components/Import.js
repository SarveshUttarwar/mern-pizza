import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { UPLOAD_FILE_ENDPOINT } from './config';
import "../App.css";

function ImportData() {
  const [importLog, setImportLog] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [previewHeaders, setPreviewHeaders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [importSource, setImportSource] = useState("Local device");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef(null);

  const API_ENDPOINT = UPLOAD_FILE_ENDPOINT;
  const PROXY_ENDPOINT = "http://192.168.60.127:8080/proxy"; // Ensure this endpoint is implemented

  console.log("API Endpoint configured as:", API_ENDPOINT);

  const mandatoryFields = ["OrderDate", "QtyOrdered"];

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://192.168.60.127:8080/files");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch file list: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setFileList(data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Error fetching files. Please try again.");
    }
  };

  const handleImportClick = () => {
    if (importSource === "Local device") {
      fileInputRef.current.click();
    } else if (importSource === "Online") {
      if (!urlInput) {
        alert("Please enter a valid URL.");
        return;
      }
      handleUrlImport();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType !== "csv" && fileType !== "xlsx" && fileType !== "xls") {
      alert("Unsupported file type. Please upload CSV or Excel files only.");
      fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImportLog(`File "${file.name}" uploaded successfully as "${result.filename}"`);
        alert("File uploaded successfully!");
        fetchFiles();
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    }

    fileInputRef.current.value = "";
  };

  const handleUrlImport = async () => {
    try {
      let fetchUrl = urlInput;

      // Handle Google Sheets URL by converting to CSV export link
      if (urlInput.includes("docs.google.com/spreadsheets")) {
        const sheetIdMatch = urlInput.match(/\/d\/([a-zA-Z0-9-_]+)/);
        let gidMatch = urlInput.match(/gid=(\d+)/);
        if (sheetIdMatch && sheetIdMatch[1]) {
          fetchUrl = `https://docs.google.com/spreadsheets/d/${sheetIdMatch[1]}/export?format=csv`;
          // Handle duplicate gid parameters, take the first valid one
          if (gidMatch && gidMatch[1]) {
            fetchUrl += `&gid=${gidMatch[1]}`;
          } else {
            fetchUrl += "&gid=0"; // Default to first sheet
          }
          console.log("Generated export URL:", fetchUrl);
        } else {
          throw new Error("Invalid Google Sheets URL. Please use a valid spreadsheet link.");
        }

        // Use proxy for Google Sheets to bypass CORS
        const proxyResponse = await fetch(`${PROXY_ENDPOINT}?url=${encodeURIComponent(fetchUrl)}`, {
          mode: "cors",
        });
        if (!proxyResponse.ok) {
          const errorText = await proxyResponse.text();
          console.error("Proxy response error:", errorText);
          throw new Error(`Proxy fetch failed: ${proxyResponse.status} - ${errorText}`);
        }
        const proxyData = await proxyResponse.blob();
        fetchUrl = URL.createObjectURL(proxyData); // Use proxied data
      } else {
        // Try client-side fetch for non-Google Sheets URLs
        const response = await fetch(fetchUrl, {
          mode: "cors",
          credentials: "omit",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        }
        fetchUrl = URL.createObjectURL(await response.blob());
      }

      const response = await fetch(fetchUrl, {
        mode: "cors",
      });
      if (!response.ok) {
        throw new Error(`Failed to process fetched data: ${response.status} - ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      let fileName = urlInput.split("/").pop() || "imported_file";
      let blob = await response.blob();

      if (contentType && contentType.includes("text/csv")) {
        fileName = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
        blob = new Blob([await blob.text()], { type: "text/csv" });
      } else if (contentType && contentType.includes("spreadsheetml.sheet")) {
        fileName = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
        blob = new Blob([await blob.arrayBuffer()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      } else {
        throw new Error("Unsupported file type. Please provide a CSV or Excel file URL.");
      }

      const file = new File([blob], fileName, { type: blob.type });

      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      const result = await uploadResponse.json();

      if (uploadResponse.ok) {
        setImportLog(`File "${fileName}" uploaded successfully as "${result.filename}"`);
        alert("File uploaded successfully!");
        fetchFiles();
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("URL import error:", error);
      alert(`Error importing from URL: ${error.message}. Ensure the URL is correct, the file is publicly accessible, and the proxy is running. For Google Sheets, use /export?format=csv&gid=... and share publicly. Check console for details.`);
    }

    setUrlInput("");
  };

  const handlePreview = async (filename) => {
    try {
      const url = `http://192.168.60.127:8080/download/${encodeURIComponent(filename)}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch failed with status ${response.status}: ${errorText}`);
      }

      const fileType = filename.split(".").pop().toLowerCase();
      if (fileType === "csv") {
        const text = await response.text();
        Papa.parse(text, {
          complete: (result) => {
            const headers = result.data[0] || [];
            const rows = result.data.slice(1, 11);
            setPreviewHeaders(headers);
            setPreviewData(rows);
            setShowPreview(true);
          },
          header: false,
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
        const headers = jsonData[0] || [];
        const rows = jsonData.slice(1, 11);
        setPreviewHeaders(headers);
        setPreviewData(rows);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Full preview error:", error);
      alert(`Error previewing file: ${error.message}`);
    }
  };

  const handleDelete = async (filename) => {
    try {
      const url = "http://192.168.60.127:8080/deletefile";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: filename }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete failed with status ${response.status}: ${errorText}`);
      }
      const result = await response.json();
      alert(`File "${filename}" deleted successfully!`);
      fetchFiles();
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Error deleting file: ${error.message}`);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewData(null);
    setPreviewHeaders([]);
  };

  return (
    <div className="import-data-container">
      <div className="template-container">
        <div className="template-card">
          <h3 className="template-title">Upload Data</h3>
          <div className="template-content">
            <label>Import from</label>
            <select
              className="input-field"
              value={importSource}
              onChange={(e) => setImportSource(e.target.value)}
            >
              <option>Local device</option>
              <option>Online</option>
            </select>

            {importSource === "Online" && (
              <div style={{ marginTop: "10px" }}>
                <label>Enter URL</label>
                <input
                  type="text"
                  className="input-field"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste file URL (CSV or Excel, use /export?format=csv&gid=... for Google Sheets)"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>
            )}

            <div className="btn-group" style={{ marginTop: "20px" }}>
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
              accept=".csv,.xlsx,.xls"
            />
          </div>
        </div>
      </div>

      <div className="import-log">
        <h3>Import log</h3>
        <p>{importLog || "No files uploaded yet"}</p>
      </div>

      <div className="file-list" style={{ marginTop: "20px" }}>
        <h3 className="UploadedFiles"><b>Uploaded Files</b></h3>
        {fileList.length > 0 ? (
          <ul>
            {fileList.map((file, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => handleDelete(file)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "#ff0000",
                    marginRight: "8px",
                    padding: "0",
                  }}
                  title={`Delete ${file}`}
                >
                  ✕
                </button>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreview(file);
                  }}
                  style={{ color: "#007bff", cursor: "pointer" }}
                >
                  {file}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files available yet</p>
        )}
      </div>

      {showPreview && previewData && (
        <div className="preview-overlay" style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "400px",
          background: "#fff",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          boxShadow: "0 0 10px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <h3 style={{ margin: 0 }}>Preview: First 10 Rows</h3>
            <button
              onClick={closePreview}
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#ff0000",
                padding: "0",
                lineHeight: "1",
              }}
              title="Close"
            >
              ✕
            </button>
          </div>
          <div style={{ flex: 1, overflowX: "auto", overflowY: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: "600px" }}>
              <thead>
                <tr>
                  {previewHeaders.map((header, index) => (
                    <th key={index} style={{ border: "1px solid #ddd", padding: "8px", background: "#f5f5f5" }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{ border: "1px solid #ddd", padding: "8px" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImportData;
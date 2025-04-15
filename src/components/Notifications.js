import React, { useState, useEffect } from "react";
import { FaTimes, FaTrash, FaCheck } from "react-icons/fa";
import "../App.css";

function NotificationPopup({ togglePopup }) {
  const [newNotifications, setNewNotifications] = useState([
    { id: 1, text: "📊 New Forecast Available - Forecast for Q2 is ready.", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), action: "view" },
    { id: 2, text: "📥 Data Import Successful - Latest sales data imported.", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { id: 3, text: "🚨 Stock Alert - Inventory level for Product X is low!", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), action: "view" },
  ]);
  const [oldNotifications, setOldNotifications] = useState([
    { id: 4, text: "✅ Forecast Reviewed - Q1 forecast approved.", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 5, text: "🛠️ Settings Updated - Demand parameters modified.", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  ]);

  useEffect(() => {
    // Load notifications from local storage
    const storedNew = localStorage.getItem("newNotifications");
    const storedOld = localStorage.getItem("oldNotifications");
    if (storedNew) setNewNotifications(JSON.parse(storedNew));
    if (storedOld) setOldNotifications(JSON.parse(storedOld));

    // Add event listener for Escape key
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        togglePopup();
      }
    };
    window.addEventListener("keydown", handleEscape);

    // Cleanup event listener
    return () => window.removeEventListener("keydown", handleEscape);
  }, [togglePopup]);

  useEffect(() => {
    // Save notifications to local storage
    localStorage.setItem("newNotifications", JSON.stringify(newNotifications));
    localStorage.setItem("oldNotifications", JSON.stringify(oldNotifications));
  }, [newNotifications, oldNotifications]);

  const markAsRead = (notification) => {
    setNewNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    setOldNotifications((prev) => [...prev, { ...notification, timestamp: new Date().toISOString() }]);
  };

  const clearNotification = (id, type) => {
    if (type === "new") {
      setNewNotifications((prev) => prev.filter((n) => n.id !== id));
    } else {
      setOldNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const clearAll = (type) => {
    if (type === "new") {
      setNewNotifications([]);
    } else {
      setOldNotifications([]);
    }
  };

  const handleAction = (notification) => {
    if (notification.action === "view") {
      alert(`Action: View details for "${notification.text}" (Not implemented)`);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = (now - date) / 1000; // Difference in seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-popup">
      <div className="popup-header">
        <h3>🔔 Notifications</h3>
        <FaTimes className="close-icon" onClick={togglePopup} />
      </div>

      {/* New Notifications */}
      <div className="notification-section">
        <div className="section-header">
          <h4>New Notifications</h4>
          {newNotifications.length > 0 && (
            <button className="clear-all-btn" onClick={() => clearAll("new")}>
              Clear All
            </button>
          )}
        </div>
        {newNotifications.length > 0 ? (
          newNotifications.map((notification) => (
            <div key={notification.id} className="notification-item new">
              <div className="notification-content">
                <p>{notification.text}</p>
                <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
              </div>
              <div className="notification-actions">
                <button className="action-btn mark-read" onClick={() => markAsRead(notification)}>
                  <FaCheck /> Mark as Read
                </button>
                {notification.action && (
                  <button className="action-btn view" onClick={() => handleAction(notification)}>
                    View
                  </button>
                )}
                <button className="action-btn clear" onClick={() => clearNotification(notification.id, "new")}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifications">No new notifications</p>
        )}
      </div>

      {/* Old Notifications */}
      <div className="notification-section">
        <div className="section-header">
          <h4>Old Notifications</h4>
          {oldNotifications.length > 0 && (
            <button className="clear-all-btn" onClick={() => clearAll("old")}>
              Clear All
            </button>
          )}
        </div>
        {oldNotifications.length > 0 ? (
          oldNotifications.map((notification) => (
            <div key={notification.id} className="notification-item old">
              <div className="notification-content">
                <p>{notification.text}</p>
                <span className="timestamp">{formatTimestamp(notification.timestamp)}</span>
              </div>
              <div className="notification-actions">
                <button className="action-btn clear" onClick={() => clearNotification(notification.id, "old")}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-notifications">No old notifications</p>
        )}
      </div>
    </div>
  );
}

export default NotificationPopup;
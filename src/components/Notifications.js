import React, { useState, useEffect } from "react";
import { FaTimes, FaTrash, FaCheck, FaEye } from "react-icons/fa";
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
    const storedNew = localStorage.getItem("newNotifications");
    const storedOld = localStorage.getItem("oldNotifications");
    if (storedNew) setNewNotifications(JSON.parse(storedNew));
    if (storedOld) setOldNotifications(JSON.parse(storedOld));

    const handleEscape = (e) => {
      if (e.key === "Escape") togglePopup();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [togglePopup]);

  useEffect(() => {
    localStorage.setItem("newNotifications", JSON.stringify(newNotifications));
    localStorage.setItem("oldNotifications", JSON.stringify(oldNotifications));
  }, [newNotifications, oldNotifications]);

  // Listen for import success event
  useEffect(() => {
    const handleImportSuccess = (e) => {
      const { filename } = e.detail || {};
      const newNotification = {
        id: Date.now(),
        text: `📥 Data Import Successful - Latest sales data "${filename}" imported.`,
        timestamp: new Date().toISOString(),
      };
      setNewNotifications((prev) => [newNotification, ...prev]);
    };
    window.addEventListener("importSuccess", handleImportSuccess);
    return () => window.removeEventListener("importSuccess", handleImportSuccess);
  }, []);

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
    const diff = (now - date) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-popup">
      <div className="popup-header flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <span className="mr-2">🔔</span> Notifications
        </h3>
        <button onClick={togglePopup} className="text-gray-500 hover:text-red-500 transition-colors">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="section-header flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-700">New Notifications</h4>
          {newNotifications.length > 0 && (
            <button
              onClick={() => clearAll("new")}
              className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="notification-list space-y-3 max-h-[60vh] overflow-y-auto">
          {newNotifications.length > 0 ? (
            newNotifications.map((notification) => (
              <div key={notification.id} className="notification-item bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-800 text-sm">{notification.text}</p>
                    <span className="text-xs text-gray-500 block mt-1">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  <div className="notification-actions flex space-x-3 ml-4">
                    <button
                      onClick={() => markAsRead(notification)}
                      className="action-btn bg-blue-900 text-white p-1 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center w-9 h-9"
                      title="Mark as Read"
                    >
                      <FaCheck size={14} />
                    </button>
                    {notification.action && (
                      <button
                        onClick={() => handleAction(notification)}
                        className="action-btn bg-blue-900 text-white p-1 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center w-9 h-9"
                        title="View"
                      >
                        <FaEye size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => clearNotification(notification.id, "new")}
                      className="action-btn bg-blue-900 text-white p-1 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center w-9 h-9"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-2">No new notifications</p>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="section-header flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-700">Old Notifications</h4>
          {oldNotifications.length > 0 && (
            <button
              onClick={() => clearAll("old")}
              className="bg-blue-900 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-800 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="notification-list space-y-3 max-h-[60vh] overflow-y-auto">
          {oldNotifications.length > 0 ? (
            oldNotifications.map((notification) => (
              <div key={notification.id} className="notification-item bg-gray-100 border-l-4 border-gray-300 p-3 rounded-r-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">{notification.text}</p>
                    <span className="text-xs text-gray-500 block mt-1">{formatTimestamp(notification.timestamp)}</span>
                  </div>
                  <div className="notification-actions flex space-x-3 ml-4">
                    <button
                      onClick={() => clearNotification(notification.id, "old")}
                      className="action-btn bg-blue-900 text-white p-1 rounded-full hover:bg-blue-800 transition-colors flex items-center justify-center w-9 h-9"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center py-2">No old notifications</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPopup;
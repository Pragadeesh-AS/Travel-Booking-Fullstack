import { useState, useEffect } from "react";
import api from "../../config/api";
import "../../styles/AdminDashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats?.bookings.total || 0}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats?.bookings.confirmed || 0}</h3>
            <p>Confirmed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{stats?.bookings.cancelled || 0}</h3>
            <p>Cancelled</p>
          </div>
        </div>

        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats?.revenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚌</div>
          <div className="stat-info">
            <h3>{stats?.buses || 0}</h3>
            <p>Total Buses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-info">
            <h3>{stats?.routes || 0}</h3>
            <p>Active Routes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats?.users || 0}</h3>
            <p>Registered Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

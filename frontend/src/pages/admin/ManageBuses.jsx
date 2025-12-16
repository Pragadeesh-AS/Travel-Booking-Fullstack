import { useState, useEffect } from "react";
import api from "../../config/api";
import "../../styles/AdminPages.css";

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    busNumber: "",
    busType: "AC",
    seatType: "Seater",
    operator: "",
    amenities: [],
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await api.get("/admin/buses");
      setBuses(response.data.data);
    } catch (err) {
      alert("Failed to load buses");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting bus data:", formData);

    try {
      let response;
      if (editingId) {
        response = await api.put(`/admin/buses/${editingId}`, formData);
        alert("Bus updated successfully");
      } else {
        response = await api.post("/admin/buses", formData);
        alert("Bus added successfully");
      }
      console.log("Success response:", response.data);
      resetForm();
      fetchBuses();
    } catch (err) {
      console.error("Error adding bus:", err);
      console.error("Error response:", err.response);
      const errorMessage =
        err.response?.data?.error || err.message || "Operation failed";
      alert(`Error: ${errorMessage}\nCheck console for details`);
    }
  };

  const handleEdit = (bus) => {
    setFormData({
      name: bus.name,
      busNumber: bus.busNumber,
      busType: bus.busType,
      seatType: bus.seatType,
      operator: bus.operator,
      amenities: bus.amenities || [],
    });
    setEditingId(bus._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bus?")) return;
    try {
      await api.delete(`/admin/buses/${id}`);
      alert("Bus deleted");
      fetchBuses();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      busNumber: "",
      busType: "AC",
      seatType: "Seater",
      operator: "",
      amenities: [],
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Manage Buses</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Bus"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Bus Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Bus Number"
            value={formData.busNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                busNumber: e.target.value.toUpperCase(),
              })
            }
            required
          />
          <select
            value={formData.busType}
            onChange={(e) =>
              setFormData({ ...formData, busType: e.target.value })
            }
          >
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
            <option value="Sleeper">Sleeper</option>
            <option value="Semi-Sleeper">Semi-Sleeper</option>
            <option value="Volvo">Volvo</option>
            <option value="Luxury">Luxury</option>
          </select>
          <select
            value={formData.seatType}
            onChange={(e) =>
              setFormData({ ...formData, seatType: e.target.value })
            }
            required
          >
            <option value="Seater">Seater (40 seats)</option>
            <option value="Semi-Sleeper">Semi-Sleeper (35 seats)</option>
            <option value="Sleeper">Sleeper (30 berths)</option>
          </select>
          <div className="info-message">
            <p>
              <strong>ℹ️ Note:</strong> Seat layout will be automatically
              generated based on the selected seat type.
            </p>
          </div>
          <input
            type="text"
            placeholder="Operator Name"
            value={formData.operator}
            onChange={(e) =>
              setFormData({ ...formData, operator: e.target.value })
            }
            required
          />
          <button type="submit" className="btn btn-success">
            {editingId ? "Update Bus" : "Add Bus"}
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Name</th>
              <th>Type</th>
              <th>Seats</th>
              <th>Operator</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus._id}>
                <td>{bus.busNumber}</td>
                <td>{bus.name}</td>
                <td>{bus.busType}</td>
                <td>{bus.totalSeats}</td>
                <td>{bus.operator}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleEdit(bus)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(bus._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBuses;

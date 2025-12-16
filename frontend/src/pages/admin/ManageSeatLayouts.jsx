import { useState, useEffect } from "react";
import api from "../../config/api";
import "../../styles/AdminPages.css";

const ManageSeatLayouts = () => {
  const [buses, setBuses] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBus, setSelectedBus] = useState("");
  const [busDetails, setBusDetails] = useState(null);

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

  const handleBusSelect = async (busId) => {
    setSelectedBus(busId);
    const bus = buses.find((b) => b._id === busId);
    setBusDetails(bus);

    // Generate default seat layout
    const defaultSeats = generateSeats(bus.totalSeats);
    setLayouts(defaultSeats);
    setShowForm(true);
  };

  const generateSeats = (totalSeats) => {
    const seats = [];
    const seatsPerRow = 4; // 2x2 layout

    for (let i = 0; i < totalSeats; i++) {
      const row = Math.floor(i / seatsPerRow) + 1;
      const col = (i % seatsPerRow) + 1;
      const seatLetter = String.fromCharCode(65 + Math.floor(i / seatsPerRow)); // A, B, C...
      const seatNumber = col;

      seats.push({
        seatNumber: `${seatLetter}${seatNumber}`,
        row: row,
        column: col,
        type: "seater",
        position: col === 1 || col === 4 ? "window" : "aisle",
        deck: "lower",
      });
    }

    return seats;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const layoutData = {
        busId: selectedBus,
        layout: "2x2",
        seats: layouts,
      };

      await api.post("/admin/seat-layouts", layoutData);
      alert("Seat layout created successfully!");
      setShowForm(false);
      setSelectedBus("");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Failed to create seat layout";
      alert(errorMsg);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <h2>Manage Seat Layouts</h2>
      </div>

      {!showForm ? (
        <div className="select-bus-section">
          <h3>Select a Bus to Create Seat Layout</h3>
          <div className="bus-grid">
            {buses.map((bus) => (
              <div
                key={bus._id}
                className="bus-select-card"
                onClick={() => handleBusSelect(bus._id)}
              >
                <h4>{bus.name}</h4>
                <p>Bus Number: {bus.busNumber}</p>
                <p>Total Seats: {bus.totalSeats}</p>
                <p>Type: {bus.busType}</p>
                <button className="btn btn-primary">Create Layout</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="seat-layout-form">
          <div className="form-header">
            <h3>Create Seat Layout for {busDetails?.name}</h3>
            <button
              className="btn btn-outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>

          <div className="layout-info">
            <p>
              <strong>Bus Number:</strong> {busDetails?.busNumber}
            </p>
            <p>
              <strong>Total Seats:</strong> {busDetails?.totalSeats}
            </p>
            <p>
              <strong>Layout Type:</strong> 2x2 (4 seats per row)
            </p>
          </div>

          <div className="seat-preview">
            <h4>Seat Layout Preview</h4>
            <div className="preview-grid">
              {layouts.map((seat, idx) => (
                <div key={idx} className="preview-seat">
                  {seat.seatNumber}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <button type="submit" className="btn btn-success btn-large">
              Create Seat Layout for {busDetails?.totalSeats} Seats
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageSeatLayouts;

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../config/api";
import "../styles/SeatSelection.css";

const SeatSelection = () => {
  const { busId, routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [route, setRoute] = useState(null);
  const date = searchParams.get("date");

  useEffect(() => {
    fetchSeatLayout();
    fetchRouteDetails();
  }, []);

  const fetchSeatLayout = async () => {
    try {
      const response = await api.get(
        `/buses/${busId}/seats?routeId=${routeId}&date=${date}`
      );
      setSeatLayout(response.data.data);
    } catch (err) {
      setError("Failed to load seat layout");
    } finally {
      setLoading(false);
    }
  };

  const fetchRouteDetails = async () => {
    try {
      const response = await api.get(`/buses/${busId}`);
      const routeData = response.data.data.routes.find(
        (r) => r._id === routeId
      );
      setRoute(routeData);
    } catch (err) {
      console.error("Error fetching route details");
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    if (selectedSeats.find((s) => s.seatNumber === seat.seatNumber)) {
      setSelectedSeats(
        selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber)
      );
    } else {
      if (selectedSeats.length < 6) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert("You can select maximum 6 seats");
      }
    }
  };

  const handleProceed = () => {
    if (!isAuthenticated) {
      alert("Please login to continue booking");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    // Store booking data in localStorage and navigate to booking form
    const bookingData = {
      busId,
      routeId,
      date,
      selectedSeats: selectedSeats.map((s) => s.seatNumber),
      totalAmount: route?.price * selectedSeats.length,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
    navigate("/booking-form");
  };

  if (loading) return <div className="loader">Loading seats...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="seat-selection">
      <div className="seat-selection-header">
        <h2>Select Your Seats</h2>
        {route && (
          <p>
            {route.source} → {route.destination}
          </p>
        )}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-demo available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-demo selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat-demo booked"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="seat-layout-container">
        <div className="driver-section">
          <svg
            className="steering-wheel"
            viewBox="0 0 100 100"
            width="40"
            height="40"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#6b7280"
              strokeWidth="8"
            />
            <circle cx="50" cy="50" r="20" fill="#6b7280" />
            <path
              d="M50 30 L50 15 M50 70 L50 85 M30 50 L15 50 M70 50 L85 50"
              stroke="#6b7280"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="seats-grid">
          {seatLayout?.seats.map((seat, index) => {
            const isSelected = selectedSeats.find(
              (s) => s.seatNumber === seat.seatNumber
            );
            const isAisle = index % 4 === 1; // Add space after 2nd seat in each row
            const isSleeper = seat.type === "sleeper";

            return (
              <React.Fragment key={seat.seatNumber}>
                <div
                  className={`seat ${seat.isBooked ? "booked" : ""} ${
                    isSelected ? "selected" : ""
                  } ${isSleeper ? "sleeper-bed" : ""}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {isSleeper ? (
                    // Bed icon for sleeper seats
                    <svg
                      className="seat-icon bed-icon"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78c-.61.55-1 1.34-1 2.22v6h2v-2h16v2h2v-6c0-.88-.39-1.67-1-2.22zM14 7h4c.55 0 1 .45 1 1v2h-6V8c0-.55.45-1 1-1zM5 8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2H5V8zm-1 7v-2c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v2H4z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    // Chair icon for regular seats
                    <svg
                      className="seat-icon"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  <div className="seat-info">
                    {seat.isBooked ? (
                      <span className="seat-status">Sold</span>
                    ) : isSelected ? (
                      <span className="seat-price">₹{route?.price || 0}</span>
                    ) : (
                      <span className="seat-price">₹{route?.price || 0}</span>
                    )}
                  </div>
                </div>
                {isAisle && <div className="aisle"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="booking-summary">
        <div className="summary-content">
          <div className="selected-info">
            <h3>
              Selected Seats:{" "}
              {selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}
            </h3>
            <p>Total: ₹{route ? route.price * selectedSeats.length : 0}</p>
          </div>
          <button
            className="btn btn-primary btn-large"
            onClick={handleProceed}
            disabled={selectedSeats.length === 0}
          >
            Proceed to Book ({selectedSeats.length} seats)
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;

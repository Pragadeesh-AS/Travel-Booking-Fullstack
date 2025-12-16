import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // List of Tamil Nadu cities - matching routes in database
  const cities = [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Trichy",
    "Erode",
    "Tirunelveli",
    "Vellore",
    "Thoothukudi",
    "Dindigul",
    "Thanjavur",
    "Kanchipuram",
    "Namakkal",
    "Hosur",
  ];

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await api.get("/buses");
      setBuses(response.data.data.slice(0, 6)); // Show only first 6 buses
    } catch (err) {
      console.error("Error fetching buses");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/search?source=${searchData.source}&destination=${searchData.destination}&date=${searchData.date}`
    );
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Your Bus Journey</h1>
          <p>Safe, Comfortable & Affordable Bus Tickets</p>

          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              <select
                value={searchData.source}
                onChange={(e) =>
                  setSearchData({ ...searchData, source: e.target.value })
                }
                required
              >
                <option value="">Select Source City</option>
                {cities.map((city) => (
                  <option key={`source-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <select
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData({ ...searchData, destination: e.target.value })
                }
                required
              >
                <option value="">Select Destination City</option>
                {cities.map((city) => (
                  <option key={`dest-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={searchData.date}
                onChange={(e) =>
                  setSearchData({ ...searchData, date: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
                required
              />
              <button type="submit" className="btn btn-primary">
                Search Buses
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Available Buses */}
      <section className="available-buses">
        <div className="container">
          <h2>Available Buses</h2>
          {loading ? (
            <p className="loading-text">Loading buses...</p>
          ) : buses.length === 0 ? (
            <p className="no-buses">
              No buses available yet. Admin can add buses from the admin panel.
            </p>
          ) : (
            <div className="buses-grid">
              {buses.map((bus) => (
                <div key={bus._id} className="bus-card-home">
                  <div className="bus-header">
                    <h4>{bus.name}</h4>
                    <span className="bus-type-badge">{bus.busType}</span>
                  </div>
                  <div className="bus-details">
                    <p>
                      <strong>Bus Number:</strong> {bus.busNumber}
                    </p>
                    <p>
                      <strong>Operator:</strong> {bus.operator}
                    </p>
                    <p>
                      <strong>Total Seats:</strong> {bus.totalSeats}
                    </p>
                    {bus.rating > 0 && (
                      <div className="bus-rating">
                        <div className="rating-badge">
                          ⭐ {bus.rating.toFixed(1)}
                        </div>
                        <span className="review-count">
                          ({bus.reviewCount}{" "}
                          {bus.reviewCount === 1 ? "review" : "reviews"})
                        </span>
                      </div>
                    )}
                  </div>
                  {bus.amenities && bus.amenities.length > 0 && (
                    <div className="bus-amenities">
                      <strong>Amenities:</strong>
                      <div className="amenities-list">
                        {bus.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="amenity-tag">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {buses.length > 0 && (
            <div className="view-all">
              <Link to="/search" className="btn btn-outline">
                View All Routes
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Easy Booking</h3>
              <p>Book your bus tickets in just a few clicks</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Get the best deals and offers on bus tickets</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚌</div>
              <h3>Wide Network</h3>
              <p>Thousands of routes across the country</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure payment gateway</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

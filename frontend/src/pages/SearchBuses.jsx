import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../config/api";
import "../styles/SearchBuses.css";

const SearchBuses = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    busTypes: [],
    minPrice: 0,
    maxPrice: 5000,
    departureTime: "all",
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState("price-low");

  const source = searchParams.get("source");
  const destination = searchParams.get("destination");
  const date = searchParams.get("date");

  useEffect(() => {
    if (source && destination && date) {
      searchBuses();
    }
  }, [source, destination, date]);

  useEffect(() => {
    applyFilters();
  }, [buses, filters, sortBy]);

  const searchBuses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(
        `/buses/search?source=${source}&destination=${destination}&date=${date}`
      );
      setBuses(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to search buses");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...buses];

    // Filter by bus types
    if (filters.busTypes.length > 0) {
      result = result.filter((route) =>
        filters.busTypes.includes(route.bus.busType)
      );
    }

    // Filter by price range
    result = result.filter(
      (route) =>
        route.price >= filters.minPrice && route.price <= filters.maxPrice
    );

    // Filter by departure time
    if (filters.departureTime !== "all") {
      result = result.filter((route) => {
        const hour = parseInt(route.departureTime.split(":")[0]);

        switch (filters.departureTime) {
          case "early-morning": // 12 AM - 6 AM
            return hour >= 0 && hour < 6;
          case "morning": // 6 AM - 12 PM
            return hour >= 6 && hour < 12;
          case "afternoon": // 12 PM - 6 PM
            return hour >= 12 && hour < 18;
          case "evening": // 6 PM - 12 AM
            return hour >= 18;
          default:
            return true;
        }
      });
    }

    // Filter by rating
    if (filters.minRating > 0) {
      result = result.filter(
        (route) => (route.bus.rating || 0) >= filters.minRating
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.bus.rating || 0) - (a.bus.rating || 0));
        break;
      case "departure":
        result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      default:
        break;
    }

    setFilteredBuses(result);
  };

  const handleBusTypeChange = (busType) => {
    setFilters((prev) => ({
      ...prev,
      busTypes: prev.busTypes.includes(busType)
        ? prev.busTypes.filter((t) => t !== busType)
        : [...prev.busTypes, busType],
    }));
  };

  const handleSelectBus = (busId, routeId) => {
    navigate(`/seat-selection/${busId}/${routeId}?date=${date}`);
  };

  if (loading) {
    return <div className="loader">Searching buses...</div>;
  }

  return (
    <div className="search-buses">
      <div className="search-header">
        <div className="container">
          <h2>
            {source} → {destination}
          </h2>
          <p>
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-content container">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <h3>Filters</h3>

          {/* Bus Type Filter */}
          <div className="filter-section">
            <h4>Bus Type</h4>
            {["AC", "Non-AC", "Sleeper", "Semi-Sleeper", "Volvo", "Luxury"].map(
              (type) => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.busTypes.includes(type)}
                    onChange={() => handleBusTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              )
            )}
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: Number(e.target.value) })
                }
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
              />
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) })
              }
              className="price-slider"
            />
            <div className="price-labels">
              <span>₹{filters.minPrice}</span>
              <span>₹{filters.maxPrice}</span>
            </div>
          </div>

          {/* Departure Time Filter */}
          <div className="filter-section">
            <h4>Departure Time</h4>
            {[
              { value: "all", label: "All Times" },
              { value: "early-morning", label: "Early Morning (12AM - 6AM)" },
              { value: "morning", label: "Morning (6AM - 12PM)" },
              { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
              { value: "evening", label: "Evening (6PM - 12AM)" },
            ].map((time) => (
              <label key={time.value} className="filter-radio">
                <input
                  type="radio"
                  name="departureTime"
                  checked={filters.departureTime === time.value}
                  onChange={() =>
                    setFilters({ ...filters, departureTime: time.value })
                  }
                />
                <span>{time.label}</span>
              </label>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <h4>Minimum Rating</h4>
            <select
              value={filters.minRating}
              onChange={(e) =>
                setFilters({ ...filters, minRating: Number(e.target.value) })
              }
              className="rating-select"
            >
              <option value="0">All</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>

          <button
            className="btn btn-outline btn-block"
            onClick={() =>
              setFilters({
                busTypes: [],
                minPrice: 0,
                maxPrice: 5000,
                departureTime: "all",
                minRating: 0,
              })
            }
          >
            Clear Filters
          </button>
        </aside>

        {/* Buses List */}
        <main className="buses-section">
          <div className="sort-controls">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
              <option value="departure">Departure Time</option>
            </select>
            <span className="results-count">
              {filteredBuses.length}{" "}
              {filteredBuses.length === 1 ? "bus" : "buses"} found
            </span>
          </div>

          {filteredBuses.length === 0 && !loading && (
            <div className="no-results">
              <p>No buses found matching your filters.</p>
              <p>Try adjusting your filters or search criteria.</p>
            </div>
          )}

          <div className="buses-list">
            {filteredBuses.map((route) => (
              <div key={route._id} className="bus-card">
                <div className="bus-info">
                  <div className="bus-name-section">
                    <h3>{route.bus.name}</h3>
                    {route.bus.rating > 0 && (
                      <div className="bus-rating-badge">
                        ⭐ {route.bus.rating.toFixed(1)}
                        <span className="review-text">
                          ({route.bus.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="bus-type">{route.bus.busType}</p>
                  <div className="amenities">
                    {route.bus.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="amenity">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  {route.offers && (
                    <div className="offer-badge">{route.offers}</div>
                  )}
                </div>

                <div className="bus-timings">
                  <div className="timing">
                    <span className="time">{route.departureTime}</span>
                    <span className="location">{route.source}</span>
                  </div>
                  <div className="duration">
                    <span>{route.duration}</span>
                    <div className="arrow">→</div>
                  </div>
                  <div className="timing">
                    <span className="time">{route.arrivalTime}</span>
                    <span className="location">{route.destination}</span>
                  </div>
                </div>

                <div className="bus-details">
                  <div className="seats-available">
                    <span className="seats-count">{route.availableSeats}</span>
                    <span className="seats-label">Seats Available</span>
                  </div>
                  <div className="price">
                    <span className="price-label">Starting from</span>
                    <span className="price-amount">₹{route.price}</span>
                  </div>
                </div>

                <div className="bus-action">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectBus(route.bus._id, route._id)}
                    disabled={route.availableSeats === 0}
                  >
                    {route.availableSeats === 0 ? "Sold Out" : "Select Seats"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchBuses;

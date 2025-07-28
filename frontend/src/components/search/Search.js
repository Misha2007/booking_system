import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./Search.css";
import Calendar from "../UI/Calendar.js";

const API_URL = "http://localhost:3003";

const Search = () => {
  const [hotels, setHotels] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [peopleCount, setPeopleCount] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    const from = params.get("from");
    const to = params.get("to");
    const people = params.get("people");

    if (country) setSelectedLocation(country);
    if (people) setPeopleCount(people);

    if (from && to) {
      const [fromMonth, fromDay, fromYear] = from.split("-");
      const [toMonth, toDay, toYear] = to.split("-");
      setSelectedDateFrom({
        day: parseInt(fromDay),
        month: parseInt(fromMonth) - 1,
      });
      setSelectedDateTo({
        day: parseInt(toDay),
        month: parseInt(toMonth) - 1,
      });
    }
  }, [location.search]);

  const fetchHotels = async (e) => {
    if (e) e.preventDefault();
    const from = `${String(selectedDateFrom.month + 1).padStart(
      2,
      "0"
    )}-${String(selectedDateFrom.day).padStart(2, "0")}-2025`;
    const to = `${String(selectedDateTo.month + 1).padStart(2, "0")}-${String(
      selectedDateTo.day
    ).padStart(2, "0")}-2025`;
    try {
      const response = await fetch(
        `${API_URL}/hotels/available?from=${from}&to=${to}&country=${selectedLocation}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const hotelsData = Array.isArray(data)
        ? data.filter((hotel) =>
            hotel.availableRooms?.some((room) => room.available > 0)
          )
        : [];
      setHotels(hotelsData);
      setResults(hotelsData);
      navigate(
        `/search?country=${selectedLocation}&from=${from}&to=${to}&people=${peopleCount}`
      );
      sessionStorage.setItem(
        "searchData",
        JSON.stringify({
          hotelsData,
        })
      );
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("searchData");
    if (saved) {
      const data = JSON.parse(saved);
      setHotels(data.hotelsData);
      setResults(data.hotelsData);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const formatDate = (date) =>
    `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;

  const fromDate = selectedDateFrom
    ? new Date(2025, selectedDateFrom.month, selectedDateFrom.day)
    : new Date();

  const toDate = selectedDateTo
    ? new Date(2025, selectedDateTo.month, selectedDateTo.day)
    : new Date(new Date().setDate(new Date().getDate() + 10));

  useEffect(() => {
    if (!selectedDateFrom && !selectedDateTo) {
      const today = new Date();
      const defaultFromDate = today;
      const defaultToDate = new Date(today);
      defaultToDate.setDate(today.getDate() + 10);

      setSelectedDateFrom({
        day: defaultFromDate.getDate(),
        month: defaultFromDate.getMonth(),
      });

      setSelectedDateTo({
        day: defaultToDate.getDate(),
        month: defaultToDate.getMonth(),
      });
    }
  }, [selectedDateFrom, selectedDateTo]);

  const calendarHandler = (selectedRange) => {
    setSelectedDateFrom(selectedRange[0]);
    setSelectedDateTo(selectedRange.slice(-1)[0]);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <div className="search-container">
          <h1 className="search-header">Let's travel the world</h1>
          <p className="header-subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <form className="search-wrapper" onSubmit={fetchHotels}>
            <div className="search-input trip-group">
              <div className="search-element">
                <label>Location:</label>
                <div className="select">
                  <i className="fa fa-map-marker"></i>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                    }}
                    required
                  >
                    <option value="">Select location</option>
                    <option value="France">France</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Thailand">Thailand</option>
                  </select>
                </div>
              </div>
              <div className="search-element">
                <span>Date</span>
                <div
                  onClick={() => setCalendarOpen((current) => !current)}
                  className="calendar-form"
                >
                  <i className="fa fa-calendar"></i>
                  <div>
                    <span>From: {formatDate(fromDate)}</span>
                  </div>
                  <span> - </span>
                  <div>
                    <span>To: {formatDate(toDate)}</span>
                  </div>
                </div>
              </div>
              <div className="guests search-element">
                <label htmlFor="peopleNumber">Number of People</label>
                <div className="select">
                  <i className="fa fa-user"></i>
                  <select
                    id="peopleNumber"
                    name="peopleNumber"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Number of People
                    </option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button className="search-icon" type="submit">
              <i className="fa fa-search"></i>
            </button>
            {calendarOpen && <Calendar calendarHandler={calendarHandler} />}
          </form>
        </div>

        <section className="hero-section">
          <div className="hero-images">
            <div
              className="hero-image hero-image-one"
              style={{
                backgroundImage:
                  "url('https://aebc975c.delivery.rocketcdn.me/wp-content/uploads/2021/01/la-une-1-croatie.jpg')",
              }}
            ></div>
            <div
              className="hero-image hero-image-two"
              style={{
                backgroundImage:
                  "url('https://static.vecteezy.com/system/resources/previews/003/023/862/large_2x/in-plane-flight-view-from-window-with-stunning-sunset-background-free-photo.jpg')",
              }}
            ></div>
            <div
              className="hero-image hero-image-three"
              style={{
                backgroundImage:
                  "url('https://a.storyblok.com/f/55469/1792x1342/45b0d67517/city_par_01.jpg/m/filters:format(webp)')",
              }}
            ></div>
          </div>
        </section>
      </div>

      <section className="popular-destinations">
        <div className="dsa2">
          <div className="header-with-buttons">
            <h2>
              {results
                ? `Found in ${selectedLocation}`
                : "Popular Destinations"}
            </h2>
            <div className="carousel-buttons">
              <button onClick={scrollLeft} className="arrow-button left">
                &#8249;
              </button>
              <button onClick={scrollRight} className="arrow-button right">
                &#8250;
              </button>
            </div>
          </div>
          <div className="destinations" ref={scrollRef}>
            {results ? (
              <>
                {results.map((item) => (
                  <div
                    key={item.hotelId}
                    className="destination-card"
                    onClick={(e) => {
                      if (
                        e.target.tagName.toLowerCase() !== "button" &&
                        !e.target.closest("button")
                      ) {
                        navigate(`/hotel/${item.hotelId}`);
                      }
                    }}
                  >
                    {console.log(item)}
                    {item.images?.[0] && (
                      <div className="img-container">
                        <img src={item.images[0].url} alt="Preview" />
                      </div>
                    )}
                    <h3>{item.hotelName}</h3>
                    <div className="detail-container">
                      <p>${item.price} Starting</p>
                      <p>
                        <i className="fa fa-star"></i>
                        {item.hotelRating}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="destination">
                  <div className="destination-image">
                    <img src="https://i.natgeofe.com/n/3012ffcc-7361-45f6-98b3-a36d4153f660/colosseum-daylight-rome-italy.jpg" />
                  </div>

                  <p>Rome, Italy</p>
                </div>
                <div className="destination">
                  <div className="destination-image">
                    <img src="https://www.barcelo.com/guia-turismo/wp-content/uploads/2024/06/valle-de-goreme-4.jpg" />
                  </div>

                  <p>Valleys of Goreme</p>
                </div>
                <div className="destination">
                  <div className="destination-image">
                    <img src="https://www.cunard.com/content/dam/cunard/inventory-assets/ports/SYD/yqy.jpg" />
                  </div>

                  <p>Sydney, Australia</p>
                </div>
                <div className="destination">
                  <div className="destination-image">
                    <img src="https://cdn.shopify.com/s/files/1/0319/8721/files/image7_7ed35a4a-edda-494b-8282-dd81737bfaca.jpg?v=1701860752" />
                  </div>

                  <p>London, Greate England</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;

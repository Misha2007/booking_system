// import "./Login.css";
import { useState, useRef, useEffect } from "react";
import Error from "../UI/Error";
import Calendar from "../UI/Calendar";
import { FaUsers } from "react-icons/fa";

const Trip = (props) => {
  const [error, setError] = useState(null);

  const departureDateRef = useRef();
  const arrivalDateRef = useRef();
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const formatDate = (date) =>
    `${date.getDate()} ${date.toLocaleString("default", { month: "short" })}`;

  const fromDate = selectedDateFrom
    ? new Date(2025, selectedDateFrom.month, selectedDateFrom.day)
    : new Date();

  const toDate = selectedDateTo
    ? new Date(2025, selectedDateTo.month, selectedDateTo.day)
    : new Date(new Date().setDate(new Date().getDate() + 10));

  const handleCloseError = () => {
    setError(null);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const departureDate = new Date(
      2025,
      selectedDateFrom.month - 1,
      selectedDateFrom.day
    );
    const arrivalDate = new Date(
      2025,
      selectedDateTo.month - 1,
      selectedDateTo.day
    );

    if (!departureDate || !arrivalDate) {
      setError({
        title: "Missing Information",
        message: "Please select both a departure and arrival date.",
      });
      return;
    }

    if (new Date(departureDate) > new Date(arrivalDate)) {
      setError({
        title: "Invalid Dates",
        message: "Departure date cannot be after arrival date.",
      });
      return;
    }

    const tripData = {
      departureDate,
      arrivalDate,
    };

    console.log(tripData);

    if (localStorage.getItem("authToken")) {
      props.onSubmitTrip(tripData);
    } else {
      alert("You should log in!!!");
    }
  };

  const calendarHandler = (selectedRange) => {
    setSelectedDateFrom(selectedRange[0]);
    setSelectedDateTo(selectedRange.slice(-1)[0]);
  };

  return (
    <form onSubmit={submitHandler}>
      {error && (
        <Error
          title={error.title}
          message={error.message}
          onConfirm={handleCloseError}
        />
      )}

      <div className="form-group">
        <div className="trip-group">
          <div>
            <span>Date</span>
            <div
              onClick={() => setCalendarOpen(!calendarOpen)}
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

          {/* Room Type - Number of People */}
          <div>
            <label htmlFor="peopleNumber">Number of People</label>
            <div className="select">
              <i className="fa fa-user"></i>
              <select
                id="peopleNumber"
                name="peopleNumber"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select Number of People
                </option>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
              </select>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label htmlFor="roomType">Room Type</label>
            <div className="select">
              <i className="fa fa-bed"></i>
              <select id="roomType" name="roomType" defaultValue="" required>
                <option value="" disabled>
                  Select Room Type
                </option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="suite">Suite</option>
                <option value="family">Family Room</option>
              </select>
            </div>
          </div>
        </div>

        {calendarOpen ? <Calendar calendarHandler={calendarHandler} /> : ""}

        <div className="t-price">
          <h2>Price:</h2>
          <span>${props.hotel.price}</span>
        </div>

        <button type="submit" className="login_button">
          Go to Checkout
        </button>
      </div>
    </form>
  );
};

export default Trip;

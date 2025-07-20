import { useState, useRef, useEffect } from "react";
import Error from "../UI/Error";
import Calendar from "../UI/Calendar";
import data_file from "../../data.json";
import { FaUsers } from "react-icons/fa";

const Trip = (props) => {
  const [error, setError] = useState(null);

  const departureDateRef = useRef();
  const arrivalDateRef = useRef();
  const [selectedDateFrom, setSelectedDateFrom] = useState(null);
  const [selectedDateTo, setSelectedDateTo] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (
        !props.hotel ||
        !props.hotel.hotelId ||
        !selectedDateFrom ||
        !selectedDateTo
      ) {
        setRooms([]);
        return;
      }

      setLoading(true);

      const from = `${String(selectedDateFrom.month + 1).padStart(
        2,
        "0"
      )}-${String(selectedDateFrom.day).padStart(2, "0")}-2025`;
      const to = `${String(selectedDateTo.month + 1).padStart(2, "0")}-${String(
        selectedDateTo.day
      ).padStart(2, "0")}-2025`;

      try {
        const response = await fetch(
          `http://${data_file.ip}:${data_file.port}/rooms/hotel/${props.hotel.hotelId}/available?from=${from}&to=${to}`
        );
        const data = await response.json();

        // Filter rooms by capacity
        const filteredRooms =
          peopleCount === ""
            ? data
            : data.filter(
                (room) => room.details.capacity >= Number(peopleCount)
              );

        setRooms(filteredRooms);
        setLoading(false);
      } catch (err) {
        setRooms([]);
      }
    };

    fetchAvailableRooms();
  }, [props.hotel, selectedDateFrom, selectedDateTo, peopleCount]);

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
      selectedDateFrom.month,
      selectedDateFrom.day
    );
    const arrivalDate = new Date(
      2025,
      selectedDateTo.month,
      selectedDateTo.day
    );

    console.log(departureDate);
    console.log(arrivalDate);

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

    if (!selectedRoom) {
      setError({
        title: "Missing Information",
        message: "Please select a room.",
      });
      return;
    }

    const tripData = {
      departureDate,
      arrivalDate,
      roomId: Number(selectedRoom),
      numberOfGuests: peopleCount,
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

  const calculateTotalPrice = () => {
    if (!selectedRoom || !fromDate || !toDate) return 0;

    const selectedRoomObj = rooms.find(
      (room) => room.roomId === Number(selectedRoom)
    );

    console.log(selectedRoomObj);

    if (!selectedRoomObj) return 0;

    const dayCount =
      Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) || 1;

    return selectedRoomObj.details.basePrice * dayCount;
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
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="form-group" style={{ position: "relative" }}>
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

            <div>
              <label htmlFor="roomSelect">Room</label>
              <div className="select">
                <i className="fa fa-bed"></i>
                {console.log(
                  "Selected room:",
                  selectedRoom.available === 0 || rooms.length === 0
                )}
                <select
                  id="roomSelect"
                  name="roomSelect"
                  value={selectedRoom}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const room = rooms.find((r) => r.roomId == selectedId);
                    setSelectedRoom(room);
                  }}
                  required
                  style={{
                    borderColor:
                      selectedRoom.available === 0 || rooms.length === 0
                        ? "red"
                        : "#87f9",
                  }}
                >
                  <option value="" disabled>
                    {rooms.length === 0 ? "No rooms available" : "Select Room"}
                  </option>
                  {rooms.map((room) => (
                    <option key={room.roomId} value={room.roomId}>
                      {console.log(room.available === 0 && "red")}
                      {room.details.room.roomName ||
                        `Room ${room.roomId}`} - {room.details.room.roomType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {calendarOpen ? <Calendar calendarHandler={calendarHandler} /> : ""}
          {selectedRoom.available === 0 && (
            <p style={{ color: "red" }}>
              Sorry, this type of room is already sold out. Select another room
              type or/and other dates
            </p>
          )}

          {rooms.length === 0 && (
            <p style={{ color: "red" }}>
              Unfortunately, this hotel does not have available rooms for the
              required number of people on your dates. Please select another
              hotel and/or other dates.
            </p>
          )}
          <div className="t-price">
            <h2>Price:</h2>
            <span>${calculateTotalPrice()}</span>
          </div>

          <button type="submit" className="login_button">
            Go to Checkout
          </button>
        </div>
      )}
    </form>
  );
};

export default Trip;

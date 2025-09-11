import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useHotelById from "../hooks/useHotelById";
import "./AdminMain.css";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  PieChart,
  Pie,
} from "recharts";
import ChartBox from "../UI/Chart";

function AdminMain() {
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState("HotelInfo");

  const setOpenSectionFunction = (data) => {
    setOpenSection(data);
  };

  const { response, isLoading, error } = useHotelById({
    route: "admin/getHeaderData",
    method: "GET",
  });

  const COLORS = ["#8884d8", "#82ca9d", "#D8AF84", "#CA837C"];

  const iconMap = {
    region: "globe",
    room: "bed",
    booking: "suitcase",
  };

  if (isLoading) {
    return (
      <div className="admin-hotel-panel">
        <div id="admin-hotel-wrap">
          <p className="loading">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-hotel-panel">
        <div id="admin-hotel-wrap">
          <p className="error">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-hotel-panel">
      <div id="admin-hotel-wrap">
        {!isLoading && response && (
          <div className="hotel-info-wrap">
            <div id="admin-header">
              <h1>Admin Panel</h1>
              <nav>
                <Link to={"/admin"} style={{ color: "#948fa4" }}>
                  Home
                </Link>
                <Link to={"/admin/hotel/create"}>New hotel</Link>
                <Link to={"/account"}>Account</Link>
              </nav>
            </div>

            <div className="admin-panel-home">
              <div className="box box1">
                {response.map(({ key, data, dataStats }, index) => {
                  return (
                    key == "verificationCounts" && (
                      <div className="chart-info">
                        <ResponsiveContainer width={300} height="100%">
                          <PieChart width={300} height={100}>
                            <Pie
                              data={data}
                              dataKey="count"
                              nameKey="role"
                              cx="50%"
                              cy="50%"
                              outerRadius={40}
                              fill="#8884d8"
                            />
                            <Tooltip />
                            <Pie
                              data={dataStats}
                              dataKey="count"
                              nameKey="status"
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              fill="#82ca9d"
                              label
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )
                  );
                })}

                <div className="box-info">
                  {response.map(({ key, data, dataStats }, index) => {
                    if (key === "verificationCounts") {
                      return (
                        <div key={index}>
                          <div className="details-admin-main">
                            {dataStats.map(({ status, count }, subIndex) => (
                              <div key={subIndex}>
                                <p>
                                  <h2>Status:</h2>
                                  {status
                                    ? String(status).charAt(0).toUpperCase() +
                                      String(status).slice(1)
                                    : "None"}
                                </p>
                                <p>
                                  <h2>Count:</h2>
                                  {count}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="details-admin-main line">
                            {data.map(({ role, count }, subIndex) => (
                              <div key={subIndex}>
                                <p>
                                  <h2>Role:</h2>
                                  {String(role).charAt(0).toUpperCase() +
                                    String(role).slice(1)}
                                </p>
                                <p>
                                  <h2>Count:</h2>
                                  {count}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>

              {response.map(({ key, data, dataStats }, index) => {
                let chartType = "";
                let icon = "";
                let title = "";
                let link = "";

                switch (key) {
                  case "booking":
                    chartType = "line";
                    icon = "suitcase";
                    title = "Bookings";
                    link = "/admin/bookings";
                    break;
                  case "user":
                    chartType = "line";
                    icon = "users";
                    title = "Users";
                    link = "/admin/users";
                    break;
                  case "hotel":
                    chartType = "pie";
                    icon = "hotel";
                    title = "Hotels";
                    link = "/admin/hotels";
                    break;
                  case "region":
                    chartType = "bar";
                    icon = "globe";
                    title = "Regions";
                    link = "/admin/regions";
                    break;
                  case "room":
                    chartType = "bar2";
                    icon = "bed";
                    title = "Rooms";
                    link = "/admin/rooms";
                    break;
                  default:
                    break;
                }

                return (
                  <>
                    {key !== "verificationCounts" && key !== "revenue" && (
                      <ChartBox
                        key={key}
                        data={data}
                        dataStats={dataStats}
                        chartType={chartType}
                        link={link}
                        icon={icon}
                        title={title}
                        index={index}
                      />
                    )}
                  </>
                );
              })}

              <div className="box box7">
                {response.map(({ key, data, dataStats }, index) => {
                  return (
                    key === "revenue" && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          width={500}
                          height={400}
                          data={dataStats}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            fill="#8884d8"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminMain;

// ChartBox.js
import React from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// ChartBox component
const ChartBox = ({
  key,
  data,
  dataStats,
  chartType,
  link,
  icon,
  title,
  index,
}) => {
  const renderChart = () => {
    switch (chartType) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dataStats}>
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={dataStats}
                dataKey="hotelBookings"
                cx="50%"
                cy="50%"
                outerRadius={60}
                innerRadius={40}
                fill="#8884d8"
              >
                {dataStats.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={
                      ["#8884d8", "#82ca9d", "#D8AF84", "#CA837C"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataStats}>
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const { regionName, hotelCount } = payload[0].payload;
                    return (
                      <div
                        className="custom-tooltip"
                        style={{ background: "#e9f0f8ff", color: "#1f1b1bff" }}
                      >
                        <p>{`Region: ${regionName}`}</p>{" "}
                        <p>{`Hotel Count: ${hotelCount}`}</p>{" "}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="hotelCount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "bar2":
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dataStats}>
              <Tooltip />
              <Bar dataKey="booked" fill="#8884d8" />{" "}
              <Bar dataKey="totalRooms" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div key={key} className={`box box${index + 2}`}>
      <div className="box-info">
        <h1>{data}</h1>
        <h3>
          <i className={`fa fa-${icon}`}></i> {title}
        </h3>
        <Link to={link}>View {title}</Link>
      </div>
      <div className="chart-info">{renderChart()}</div>
    </div>
  );
};

export default ChartBox;

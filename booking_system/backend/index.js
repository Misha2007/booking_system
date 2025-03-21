import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import cors from "cors";
import sequelize from "./util/db.js";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);

app.use(express.urlencoded({ extended: true }));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});

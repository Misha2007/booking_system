import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/user.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);

app.use(express.urlencoded({ extended: true }));

app.listen(3002, () => {
  console.log("Server is running on http://localhost:3002/");
});

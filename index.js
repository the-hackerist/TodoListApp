const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const todosRoute = require("./routes/todosRoute");
const authRoute = require("./routes/authRoute");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());

app.get("/", (req, res) => {
  res.json({ message: "Api server is working!" });
});

app.use("/todos", todosRoute);
app.use("/auth", authRoute);

app.use((error, req, res, next) => {
  const { message, statusCode, errors } = error;

  res.status(statusCode || 500).json({
    message: message || "Internal Server Error",
    isSuccess: false,
    errors: errors || [],
  });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.75bxk.mongodb.net/${process.env.MONGO_DATABASE}`
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is live on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

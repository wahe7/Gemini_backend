const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));

app.get("/", (req, res) => {
  res.send("GEMINI Backend");
});

module.exports = app;

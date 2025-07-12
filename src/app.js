const express = require("express");
const cors = require("cors");
const app = express();

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }), 
  require("./controllers/stripe.webhook").webhook_response
);

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/chatroom", require("./routes/chatroom.routes"));
app.use("/subscribe", require("./routes/subscription.routes"));



app.get("/", (req, res) => {
  res.send("GEMINI Backend");
});


module.exports = app;



// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// dotenv.config();

// const connectDB = require("./config/db");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DB connect
// connectDB();
// app.use((req, res, next) => {
//   console.log("REQUEST:", req.method, req.url);
//   next();
// });

// // Routes
// app.use("/api/auth", require("./routes/auth_routes"));
// app.use("/api/dentists", require("./routes/dentist_routes"));
// app.use("/api/slots", require("./routes/slot_routes"));
// app.use("/api/programs", require("./routes/program_routes"));

// app.get("/", (req, res) => {
//   res.send("Dental API Running");
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

// app.post("/test", (req, res) => {
//   res.send("OK");
// });

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const app = express();

// CORS FIX (Express 5 compatible)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// DB connect
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth_routes"));
app.use("/api/patients", require("./routes/user_routes"));
app.use("/api/dentists", require("./routes/dentist_routes"));
app.use("/api/slots", require("./routes/slot_routes"));
app.use("/api/programs", require("./routes/program_routes"));
app.use("/api/appointments", require("./routes/appointment_routes"));
app.use("/api/payments", require("./routes/payment_routes"));
app.use("/api/testimonials", require("./routes/testimonial_routes"));

app.get("/", (req, res) => {
  res.send("Dental API Running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

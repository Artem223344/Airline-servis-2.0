const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const DATA_PATH = path.join(__dirname, "flights.json");

function loadFlights() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

app.get("/", (req, res) => {
  res.json({ ok: true, service: "Airline Service 2.0 mock API" });
});

// GET /flights?from=Kyiv&to=London&date=2026-02-01
app.get("/flights", (req, res) => {
  const { from = "", to = "", date = "" } = req.query;
  const flights = loadFlights();

  const norm = (v) => String(v).trim().toLowerCase();

  const result = flights.filter((f) => {
    const okFrom = !from || norm(f.from).includes(norm(from));
    const okTo = !to || norm(f.to).includes(norm(to));
    const okDate = !date || norm(f.date) === norm(date);
    return okFrom && okTo && okDate;
  });

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 Mock API running: http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/flights`);
});

// Prettier for formatting

const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/employees", (req, res) => {
  const { search, department, sort = "id", order = "asc" } = req.query;

  const allowedSort = [
    "id",
    "name",
    "department",
    "position",
    "hire_date",
    "salary",
  ];
  const allowedOrder = ["asc", "desc"];
  const sortCol = allowedSort.includes(sort) ? sort : "id";
  const sortOrder = allowedOrder.includes(order) ? order : "asc";

  let query = "SELECT * FROM employees WHERE 1=1";
  const params = [];

  if (search) {
    query += " AND (name LIKE ? OR position LIKE ? OR email LIKE ?)";
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (department && department !== "all") {
    query += " AND department = ?";
    params.push(department);
  }

  query += ` ORDER BY ${sortCol} ${sortOrder.toUpperCase()}`;

  const employees = db.prepare(query).all(...params);
  res.json(employees);
});

// Task 1 — Add Employee Create an "Add Employee" form that allows submitting a new employee record to the database via a POST /api/employees endpoint.

app.post("/api/employees", (req, res) => {
  const { name, phone, department, position, hire_date, salary, email } =
    req.body;

  if (!name || !department || !position || !hire_date || !salary || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // check if email already exists
  const existing = db
    .prepare("SELECT id FROM employees WHERE email = ?")
    .get(email);
  if (existing) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const insert_query = db.prepare(
    "INSERT INTO employees (name, phone, department, position, hire_date, salary, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  const info = insert_query.run(
    name,
    phone,
    department,
    position,
    hire_date,
    salary,
    email,
  );

  res.json({
    id: info.lastInsertRowid,
    name,
    phone,
    department,
    position,
    hire_date,
    salary,
    email,
  });
});

app.get("/api/departments", (req, res) => {
  const departments = db
    .prepare("SELECT DISTINCT department FROM employees ORDER BY department")
    .all();
  res.json(departments.map((d) => d.department));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

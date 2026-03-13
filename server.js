// Prettier for formatting

const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/employees", (req, res) => {
  const {
    search,
    department,
    sort = "id",
    order = "asc",
    page = "1",
    limit = "5",
  } = req.query;

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
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 5);
  const offset = (pageNum - 1) * limitNum;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (search) {
    whereClause += " AND (name LIKE ? OR position LIKE ? OR email LIKE ?)";
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (department && department !== "all") {
    whereClause += " AND department = ?";
    params.push(department);
  }

  const countQuery = `SELECT COUNT(*) as total FROM employees ${whereClause}`;
  const total = db.prepare(countQuery).get(...params).total;
  const totalPages = Math.max(1, Math.ceil(total / limitNum));

  let query = `SELECT * FROM employees ${whereClause}`;
  query += ` ORDER BY ${sortCol} ${sortOrder.toUpperCase()}`;
  query += " LIMIT ? OFFSET ?";

  const employees = db.prepare(query).all(...params, limitNum, offset);

  res.set("X-Page", String(pageNum));
  res.set("X-Limit", String(limitNum));
  res.set("X-Total-Count", String(total));
  res.set("X-Total-Pages", String(totalPages));
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

  const insertQuery = db.prepare(
    "INSERT INTO employees (name, phone, department, position, hire_date, salary, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  const info = insertQuery.run(
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

// **Task 2 — Edit Employee**
// Add an "Edit" button on each row that opens a form pre-filled with the employee's current data. Implement a `PUT /api/employees/:id` endpoint to save changes.
app.get("/api/employees/:id", (req, res) => {
  const id = req.params.id;
  const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);

  if (!employee) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.json(employee);
});

app.put("/api/employees/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }
  const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
  if (!employee) {
    return res.status(404).json({ error: "Employee not found" });
  }
  const { name, phone, department, position, hire_date, salary, email } =
    req.body;

  if (!name || !department || !position || !hire_date || !salary || !email) {
    return res.status(400).json({
      error:
        "Name, department, position, hire date, salary, and email are required",
    });
  }

  try {
    const updateQuery = db.prepare(
      "UPDATE employees SET name = ?, phone = ?, department = ?, position = ?, hire_date = ?, salary = ?, email = ? WHERE id = ?",
    );
    const info = updateQuery.run(
      name,
      phone || null,
      department,
      position,
      hire_date,
      salary,
      email,
      id,
    );

    if (info.changes === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({
      id,
      name,
      phone: phone || null,
      department,
      position,
      hire_date,
      salary,
      email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// **Task 3 — Delete Employee**
// Add a "Delete" button on each row with a confirmation prompt. Implement a `DELETE /api/employees/:id` endpoint to remove the record.app.delete("/api/employees/:id", (req, res) => {
app.delete("/api/employees/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }
  const employee = db.prepare("SELECT * FROM employees WHERE id = ?").get(id);
  if (!employee) {
    return res.status(404).json({ error: "Employee not found" });
  }

  try {
    const deleteQuery = db.prepare("DELETE FROM employees WHERE id = ?");
    const info = deleteQuery.run(id);

    if (info.changes === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

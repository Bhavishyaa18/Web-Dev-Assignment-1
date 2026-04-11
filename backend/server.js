const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./db.sqlite");

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium',
  isDone INTEGER DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Get tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    res.json(rows);
  });
});

// Add task
app.post("/tasks", (req, res) => {
  const { title, priority } = req.body;

  db.run(
    "INSERT INTO tasks (title, priority) VALUES (?, ?)",
    [title, priority],
    function (err) {
      res.json({ id: this.lastID });
    }
  );
});

// Update task
app.put("/tasks/:id", (req, res) => {
  const { title, priority } = req.body;

  db.run(
    "UPDATE tasks SET title=?, priority=? WHERE id=?",
    [title, priority, req.params.id],
    () => res.sendStatus(200)
  );
});

// Toggle status
app.patch("/tasks/:id/status", (req, res) => {
  db.run(
    "UPDATE tasks SET isDone = NOT isDone WHERE id=?",
    [req.params.id],
    () => res.sendStatus(200)
  );
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  db.run(
    "DELETE FROM tasks WHERE id=?",
    [req.params.id],
    () => res.sendStatus(200)
  );
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running"));
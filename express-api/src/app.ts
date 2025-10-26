import express from "express";

const app = express();

app.get("/", (req, res) => {
  // res.send("<h1>Hello, World!<h1>");
  res.status(200).json({ message: "Hello, World!" });
});

app.get("/users", (req, res) => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  res.status(200).json({ users });
});

export default app;

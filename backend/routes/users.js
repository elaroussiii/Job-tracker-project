const express = require("express");
const router = express.Router();
const usersService = require("../services/users");

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await usersService.getByEmailAndPassword(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ id: user.id, email: user.email });
  } catch (err) {
    console.error("Error while login:", err.message);
    next(err);
  }
});

// POST /api/users/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existing = await usersService.getByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const newUser = await usersService.createUser(email, password);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error while signup:", err.message);
    next(err);
  }
});

module.exports = router;

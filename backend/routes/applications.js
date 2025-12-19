// backend/routes/applications.js
const express = require("express");
const router = express.Router();
const { query } = require("../services/db");

router.post("/", async (req, res) => {
  try {
    console.log("POST /api/applications body:", req.body);

    const body = req.body || {};
    const company = body.company_name ?? body.company;
    const position = body.position;
    const contractType = body.contract_type ?? body.contractType ?? null;
    const status = body.status ?? null;
    const applyDate = body.apply_date ?? body.applyDate ?? null;
    const notes = body.notes ?? null;
    const user_id = body.user_id ?? body.id ?? null;

    if (!company || !position) {
      console.log("Validation failed:", { company, position });
      return res
        .status(400)
        .json({ message: "company and position are required" });
    }

    const sql = `
      INSERT INTO applications
      (user_id, company_name, position, contract_type, status, apply_date, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      user_id || null,
      company,
      position,
      contractType,
      status,
      applyDate,
      notes,
    ];

    const result = await query(sql, params);
    console.log("Insert result from DB:", result);
    const insertId =
      result.insertId ?? (Array.isArray(result) && result[0]?.insertId);
    return res
      .status(201)
      .json({ id: insertId ?? null, message: "Application saved" });
  } catch (err) {
    console.error("Error saving application:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

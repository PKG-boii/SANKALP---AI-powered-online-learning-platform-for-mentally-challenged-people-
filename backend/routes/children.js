const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/:parentId', (req, res) => {
  try {
    const { parentId } = req.params;
    const children = db.all(
      'SELECT * FROM children WHERE parent_id = ?',
      [parentId]
    );
    res.json({ success: true, data: children });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { parentId, name, age, preferences } = req.body;
    const result = db.run(
      'INSERT INTO children (parent_id, name, age, preferences) VALUES (?, ?, ?, ?)',
      [parentId, name, age, JSON.stringify(preferences || {})]
    );
    res.json({
      success: true,
      data: { id: result.id, name, age }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
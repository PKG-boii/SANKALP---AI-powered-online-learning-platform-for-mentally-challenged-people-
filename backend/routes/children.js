const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/:parentId', (req, res) => {
  const { parentId } = req.params;

  db.db.all(
    'SELECT * FROM children WHERE parent_id = ?',
    [parentId],
    (err, children) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, data: children });
    }
  );
});

router.post('/', (req, res) => {
  const { parentId, name, age, preferences } = req.body;

  db.db.run(
    'INSERT INTO children (parent_id, name, age, preferences) VALUES (?, ?, ?, ?)',
    [parentId, name, age, JSON.stringify(preferences || {})],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({
        success: true,
        data: { id: this.lastID, name, age }
      });
    }
  );
});

module.exports = router;

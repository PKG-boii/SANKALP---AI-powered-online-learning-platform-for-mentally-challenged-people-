const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const progress = await db.getProgress(childId);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

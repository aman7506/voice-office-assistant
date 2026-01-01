const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// GET /api/reminders - Get all reminders
router.get('/', async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().execute('GetAllReminders');
    res.json(result.recordset);
  } catch (err) {
    console.error('Get Reminders Error:', err);
    res.status(500).json({ error: 'Failed to fetch reminders' });
  }
});

// POST /api/reminders - Create new reminder
router.post('/', async (req, res) => {
  const { message, scheduled_for } = req.body;
  
  if (!message || !scheduled_for) {
    return res.status(400).json({ error: 'Message and scheduled time are required' });
  }
  
  try {
    const pool = await getConnection();
    await pool.request()
      .input('message', sql.NVarChar, message)
      .input('scheduled_for', sql.DateTime, new Date(scheduled_for))
      .execute('AddReminder');
    res.status(201).json({ message: 'Reminder added successfully' });
  } catch (err) {
    console.error('Create Reminder Error:', err);
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// PUT /api/reminders/:id - Update reminder
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { message, scheduled_for, status } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('message', sql.NVarChar, message)
            .input('scheduled_for', sql.DateTime, scheduled_for ? new Date(scheduled_for) : null)
            .input('status', sql.NVarChar, status)
            .execute('UpdateReminder');
        res.json({ message: 'Reminder updated successfully' });
    } catch (error) {
        console.error('Update Reminder Error:', error);
        res.status(500).json({ error: 'Failed to update reminder' });
    }
});

// DELETE /api/reminders/:id - Delete reminder
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .execute('DeleteReminder');
        res.json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        console.error('Delete Reminder Error:', error);
        res.status(500).json({ error: 'Failed to delete reminder' });
    }
});

// POST /api/reminders/:id/trigger - Trigger a reminder
router.post('/:id/trigger', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await getConnection();
    // Assuming you have a way to update the status, e.g., using the UpdateReminder procedure
    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.NVarChar, 'triggered')
      .execute('UpdateReminder'); // Re-using UpdateReminder to set status
    res.json({ message: 'Reminder triggered successfully' });
  } catch (err) {
    console.error('Trigger Reminder Error:', err);
    res.status(500).json({ error: 'Failed to trigger reminder' });
  }
});

module.exports = router; 
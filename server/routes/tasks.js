const express = require('express');
const router = express.Router();
const { getConnection, sql } = require('../config/database');

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().execute('GetAllTasks');
        res.json(result.recordset);
    } catch (err) {
        console.error('Get Tasks Error:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// POST /api/tasks - Create new task
router.post('/', async (req, res) => {
    const { title, description, due_date, priority } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const pool = await getConnection();
        await pool.request()
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .input('due_date', sql.DateTime, due_date ? new Date(due_date) : null)
            .input('priority', sql.NVarChar, priority)
            .execute('AddTask');
        res.status(201).json({ message: 'Task added successfully' });
    } catch (err) {
        console.error('Create Task Error:', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, due_date, priority, status } = req.body;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.NVarChar, title)
            .input('description', sql.NVarChar, description)
            .input('due_date', sql.DateTime, due_date ? new Date(due_date) : null)
            .input('priority', sql.NVarChar, priority)
            .input('status', sql.NVarChar, status)
            .execute('UpdateTask');
        res.json({ message: 'Task updated successfully' });
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, id)
            .execute('DeleteTask');
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete Task Error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

module.exports = router;
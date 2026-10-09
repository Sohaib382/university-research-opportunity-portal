const express = require('express');
const router = express.Router();
const db = require('../db');

// POST - Create a new research opportunity
router.post('/', async (req, res) => {
    try {
        const {
            research_title,
            research_description,
            research_area,
            faculty_name,
            department,
            required_skills,
            available_positions,
            application_deadline,
            status
        } = req.body;

        if (
            !research_title ||
            !research_description ||
            !research_area ||
            !faculty_name ||
            !department ||
            !required_skills ||
            available_positions === undefined ||
            !application_deadline
        ) {
            return res.status(400).json({
                message: 'All required fields must be provided'
            });
        }

        if (available_positions < 1) {
            return res.status(400).json({
                message: 'Available positions must be at least 1'
            });
        }

        const opportunityStatus = status || 'Open';

        if (!['Open', 'Closed'].includes(opportunityStatus)) {
            return res.status(400).json({
                message: 'Status must be Open or Closed'
            });
        }

        const sql = `
            INSERT INTO opportunities
            (research_title, research_description, research_area,
             faculty_name, department, required_skills,
             available_positions, application_deadline, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            research_title,
            research_description,
            research_area,
            faculty_name,
            department,
            required_skills,
            available_positions,
            application_deadline,
            opportunityStatus
        ]);

        const [rows] = await db.execute(
            'SELECT * FROM opportunities WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error while creating opportunity'
        });
    }
});


// GET - Get all research opportunities
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM opportunities ORDER BY id DESC'
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error while fetching opportunities'
        });
    }
});


// GET - Get one research opportunity by ID
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM opportunities WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found'
            });
        }

        res.status(200).json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error while fetching opportunity'
        });
    }
});


// PUT - Update a research opportunity
router.put('/:id', async (req, res) => {
    try {
        const {
            research_title,
            research_description,
            research_area,
            faculty_name,
            department,
            required_skills,
            available_positions,
            application_deadline,
            status
        } = req.body;

        if (
            !research_title ||
            !research_description ||
            !research_area ||
            !faculty_name ||
            !department ||
            !required_skills ||
            available_positions === undefined ||
            !application_deadline ||
            !status
        ) {
            return res.status(400).json({
                message: 'All required fields must be provided'
            });
        }

        if (!['Open', 'Closed'].includes(status)) {
            return res.status(400).json({
                message: 'Status must be Open or Closed'
            });
        }

        const [result] = await db.execute(
            `UPDATE opportunities
             SET research_title = ?,
                 research_description = ?,
                 research_area = ?,
                 faculty_name = ?,
                 department = ?,
                 required_skills = ?,
                 available_positions = ?,
                 application_deadline = ?,
                 status = ?
             WHERE id = ?`,
            [
                research_title,
                research_description,
                research_area,
                faculty_name,
                department,
                required_skills,
                available_positions,
                application_deadline,
                status,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found'
            });
        }

        const [rows] = await db.execute(
            'SELECT * FROM opportunities WHERE id = ?',
            [req.params.id]
        );

        res.status(200).json(rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error while updating opportunity'
        });
    }
});


// DELETE - Delete a research opportunity
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute(
            'DELETE FROM opportunities WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Research opportunity not found'
            });
        }

        res.status(200).json({
            message: 'Research opportunity deleted successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error while deleting opportunity'
        });
    }
});


module.exports = router;

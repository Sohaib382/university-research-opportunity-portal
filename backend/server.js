require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db');
const opportunityRoutes = require('./routes/opportunities');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/portal', express.static(path.join(__dirname, '../frontend')));
app.use('/api/opportunities', opportunityRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Research Opportunity Portal API is running'
    });
});

const PORT = process.env.PORT || 5000;

db.query('SELECT 1')
    .then(() => {
        console.log('MySQL database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error.message);
    });

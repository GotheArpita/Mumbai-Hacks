const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
    res.send('Sahayogi API is running');
});

app.listen(port, () => console.log(`Server started on port ${port}`));

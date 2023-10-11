const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const routes = require('./routes/router');

// Load env variables
dotenv.config({ path: './.env' });

const app = express();

app.use(bodyParser.json());
app.use(cors());

connectDB();
// app.use(routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

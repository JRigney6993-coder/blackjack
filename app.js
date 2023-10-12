// Imports of files 
const connectDB = require('./config/db');
const routes = require('./routes');
// Imports of modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const passport = require('passport')
const morgan = require('morgan')
const flash = require('connect-flash')
require('./config/passport')(passport)
const expressEJSLayout = require('express-ejs-layouts')

connectDB();

// Load env variables
dotenv.config({ path: './.env' });

const app = express();

app.use(bodyParser.json());
app.use(cors());

const user = {
    Username: "VeryCoolUsername",
    Password: "VerySecurePassword",
}

app.set('view engine', 'ejs')
app.get('/', (req,res) => {
    res.render('pages/index',{
        user: user
    })
})

// app.use(routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

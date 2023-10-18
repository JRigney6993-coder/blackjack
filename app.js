const express = require('express'); 
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport');
require('./config/passport')(passport)
require('dotenv').config()
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEJSLayout = require('express-ejs-layouts')

try {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => { console.log(`connected on Port: ${process.env.PORT}`) })
        .catch((err) => { console.log(err) })
} catch (error) {

}

app.use(morgan('tiny'))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUnitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('sucess message');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/game', require('./routes/game'));

app.use(express.static('./views/public'));

app.listen(process.env.PORT || 4000)
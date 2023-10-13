const connectDB = require('./config/db');
const routes = require('./routes');
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

dotenv.config({ path: './.env' });

const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// const user = {
//     Username: "VeryCoolUsername",
//     Password: "VerySecurePassword",
// }

// app.set('view engine', 'ejs')
// app.get('/', (req, res) => {
//     res.render('pages/index', {
//         user: user
//     })
// })

app.use(morgan('tiny'))
app.set('view engine', ejs)
app.use(expressEJSLayout);
app.use(express.urlencoded({extended: false}))

app.use(session({secret:'secret',resave:true,saveUnitialized:true}))
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

//routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))


// app.use(routes);  // Uncomment this if you want to use the routes

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

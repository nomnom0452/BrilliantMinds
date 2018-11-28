const   express             = require('express'),
        path                = require('path'),
        app                 = express(),
        mongoose            = require('mongoose'),
        bodyParser          = require('body-parser'),
        expressValidator    = require('express-validator'),
        flash               = require('connect-flash'),
        session             = require('express-session'),
        config              = require('./config/database'),
        passport            = require('passport');


//database
mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
    console.log('Connected to B_MindsDB');
});

db.on('error', function(err){
    console.log("Database not connected");
});

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator());

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//passport config
require('./config/passport');


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
    res.locals.user = req.user || null;
    next();
});

//route files
let index = require('./routes/default-route');
let student = require('./routes/student-route');
let instructor = require('./routes/instructor-route');
let course = require('./routes/course-route');

app.use('/student', student);
app.use('/instructor', instructor);
app.use('/course', course);
app.use('/', index);

//run server
app.listen(8000, function(){
    console.log('Server started at port 8000');
});
var express = require('express');
var chalk = require('chalk');
var debug = require('debug')('app');
var morgan = require('morgan');
var path = require('path');
const { SSL_OP_NO_QUERY_MTU } = require('constants');
const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

var app = express();
var port = process.env.PORT || 3001;

const config = {
    user: 'nodeilan',
    password: 'Q123456w',
    server: 'mynodelib.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'nodelibrary',
    options: {
        encrypt: true
    }
}

sql.connect(config).catch(err => debug(err));

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'ilanlib' }));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, 'public/')));
app.use('/css', express.static(path.join(__dirname, '/node_mudules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_mudules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_mudules/jquery/dist/js')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
    { link: '/books', title: 'Book' },
    { link: '/authors', title: 'Author' },
    { link: '/signout', title: 'Sign Out' }
];

var authRouter = require('./src/routes/authRoutes')(nav);
var bookRouter = require('./src/routes/bookRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/admin', adminRouter);

app.get('/', function (req, res) {
    res.render(
        'index',
        {
            title: 'My Library',
            nav: [
                { link: '/books', title: 'Books' },
                { link: '/authors', title: 'Authors' }
            ]
        }
    );
});
app.get('/signout', function(req, res){
    req.logout();
    res.redirect('/');
  });

app.listen(port, function () {
    debug(`listening on port ${chalk.green(port)}`);
});
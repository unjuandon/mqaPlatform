const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { ppid } = require('process');
const methodOverride = require('method-override');
const session = require('express-session');
const Handlebars = require('handlebars');
const flash = require('connect-flash');
const passport = require('passport')


const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');



//inicializar el servidor
const app = express();
require('./database');
require('./config/passport');


// config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');

//middleware
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave:true,
    saveUninitialized:true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//variables globales
app.use((req,res,next)=>{
    res.locals.succes_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


//rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));




//archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/img')));

//servidor escuchando

app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.get('port'));
});
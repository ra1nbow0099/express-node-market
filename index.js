const express = require('express');
const Handlebars = require('handlebars')
let path = require('path');
let csrf = require('csurf');
let flash = require('connect-flash');
let helmet = require('helmet');
let compression = require('compression');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
let homeRoutes = require('./routes/home');
let coursesRoutes = require('./routes/courses');
let addRoutes = require('./routes/add');
const ordersRoutes = require('./routes/orders')
let cardRoutes = require('./routes/card');
let authRoutes = require('./routes/auth');
let profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const fileMiddleware = require('./middleware/file')
const errorHandler = require('./middleware/error')
const keys = require('./keys');


const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
});
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');



app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(helmet())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/',homeRoutes)
app.use('/courses',coursesRoutes)
app.use('/add',addRoutes)
app.use('/card',cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)
app.use(errorHandler)

let PORT = process.env.PORT || 3000

async function start() {
    try{
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        app.listen(PORT,() => {
            console.log(`server is running on port: ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}
start()



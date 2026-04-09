var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const session = require('express-session');
const { engine } = require('express-handlebars');
const { createProxyMiddleware } = require('http-proxy-middleware');

var app = express();

// ================= PROXY CONFIG ==================
// Forward all /api requests to the Backend server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
}));

// ================= MIDDLEWARE ==================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// ================= TEMPLATE ENGINE ==================
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  helpers: {
    multiply: (a, b) => a * b,
    eq: (a, b) => a === b,
    formatCurrency: (value) => (parseFloat(value) * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
    json: (context) => JSON.stringify(context),
    formatDate: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : ''
    // ... add other helpers if needed
  }
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ================= ROUTES ==================
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const { fetchData } = require('./services/api');

// Handle explicit routes first
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// UNIVERSAL BRIDGE: Catch-all for any other routes to fetch from Backend
app.all('*', async (req, res, next) => {
  if (res.headersSent) return;

  try {
    const data = await fetchData(req.url, req);
    if (!data) return next();

    // 1. Handle Redirects
    if (data.redirect) {
      return res.redirect(data.redirect);
    }

    // 2. Handle Views
    if (data.view) {
      if (data.layout) res.locals.layout = data.layout;
      return res.render(data.view, data.data);
    } 
    
    // 3. Handle literal JSON
    if (typeof data === 'object') {
      return res.json(data);
    }
  } catch (err) {
    // Falls through to next() which usually hits 404
  }
  next();
});

// ================= ERROR HANDLER ==================
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

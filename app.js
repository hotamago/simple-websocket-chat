const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const logger = require("morgan");
//const mysqlAdmin = require('node-mysql-admin');

//Routes
const indexRouter = require("./routes/index");
const wsChat = require("./wsChat.js");

//Express
const app = express();
const port = process.env.PORT || 3000;

//Setup post
app.set('port', port);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//First include
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Path direct
app.use("/", indexRouter);
//app.use("/wsChat", wsChat);

//Admin direct
//app.use(mysqlAdmin(app));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
module.exports = app;

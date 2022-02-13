const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

// import routers
const homeRoute = require("./routers/home");
const userRoute = require("./routers/user");
const productRoute = require("./routers/product");

const app = express();
//normal middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// for cookies & file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}));

//ejs 
app.set("view engine", "ejs");

//morgan middleware
app.use(morgan(`tiny`));

// swagger doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//router middlewares
app.use("/api/v1", homeRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", productRoute);

//testing route
app.use("/signuptest",(req,res)=>{
    res.render('signuptest')
})

module.exports = app;

const express = require("express");
require("dotenv").config();
const morgan = require('morgan')
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// import routers
const homeRoute = require("./routers/home")

const app = express();
//normal middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// for cookies & file middleware
app.use(cookieParser())
app.use(fileUpload())

//morgan middleware
app.use(morgan(`tiny`))

// swagger doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//router middlewares
app.use("/api/v1",homeRoute)



module.exports = app;

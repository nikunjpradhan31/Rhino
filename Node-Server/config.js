// config.js
require('dotenv').config();
const express = require("express");
const app = express();
module.exports = {
    port: process.env.PORT || 5000,
    dbUri: process.env.ATLAS_URI,
    app: app,



};

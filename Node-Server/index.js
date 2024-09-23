//Nikunj Pradhan 5.18.2024
const express = require("express"); // creates express application
const cors = require("cors"); // allows communication from frontend
const mongoose = require("mongoose"); //library to communicate to the database
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");
const EmailRoute = require("./routes/EmailRoute");
const jwt = require("jsonwebtoken");
const config = require('./config');
const app = config.app;
//const app = express(); //creation of application
// require("dotenv").config(); //allows access to the enviorment variables
// const port = process.env.PORT || 5000; // allows the server to give a port for the hosting service
// const uri = process.env.ATLAS_URI;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use('/verify',EmailRoute);
app.listen(config.port, (req, res) => {console.log(`Server on port: ${config.port}`);});
mongoose.connect(config.dbUri).then(()=>console.log("Mongoose Database connected")).catch((error) => console.log("Mongoose Database connection failed:" , error.message));


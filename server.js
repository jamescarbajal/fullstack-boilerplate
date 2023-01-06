require('dotenv').config();
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const { resourceLimits } = require('worker_threads');

// enable express
app.use(express.json({ extended: false }));

// error timeout
const TIMEOUT = 10000;

//error handler
app.use(function (err, req, res, next){
    if (err) {
        res.status(err.status || 500)
        .type("txt")
        .send(err.message || "SERVER ERROR");
    };
});

// Root-level request logger
app.use(function requestLogger(req, res, next){
    console.log(req.method + " " + req.path + " " + req.ip + "\n");
    next();
});

// enable use body-parser to read json data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB database key
const mongoKey = process.env.MONGO_BRS_URI;

// connect to MongoDB Atlas "freeCodeCamp-PracticeCluster"
const connectMongoDb = mongoose.connect(mongoKey, { useNewUrlParser: true });
connectMongoDb;

// confirm db connection and collection
async function checkDbConnection() {
    const conn = await connectMongoDb;
    if (conn.connection.readyState === 1) {
        console.log('Connected to DB:', mongoose.connection.name + '\n');
    } else
        console.log("Failed to connect to mongoDB\n");
};
checkDbConnection();

// use express to serve files
app.use(express.static(path.join(__dirname, "/../brs/build")));

// // Serve pages to client
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, '/brs/build', 'index.html'));
// });

// confirm post to server 
app.post("/post", (req, res) => {
    res.json({ message: "Here's the JSON message!!"});
    console.log("Connected to server!\n");
});

// MongoDB schemas
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true },
    emailVerified: { type: Boolean },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: Number },
    addresses: [{
        addressId: { type: Number },
    }],
    balance: { type: Number },
    ordersId: { type: Number },
    returns: [{
        returnId: { type: Number }
    }]
});

const addressSchema = new Schema ({
    userId: { type: Number, required: true },
    address: [{
        street: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String },
        shippingAddress: { type: Boolean },
        billingAddress: { type: Boolean },  
    }]
});

const ordersSchema = new Schema ({
    userId: { type: Number, required: true },
    items: [{
        itemId: { type: Number },
    }],
    totalPrice: { type: Number },
    dateOrdered: { type: Date },
    trackingNumber: { type: String },
    return: { type: Boolean },
    returnInfo: [{
        inProgress: { type: Boolean },
        startDate: { type: Date },
        trackingNumber: { type: String },
        completed: { type: Boolean },
        completionDate: { type: Date }
    }]
});

const beadsProductSchema = new Schema ({
    productName: { type: String },
    stockQuantity: { type: Number },
    size: { type: Number },
    image: [{
        url: { type: String },
    }],
    price: { type: Number },
    category: { type: String },
    description: {type: String },
});

// listen on port 3001 or PORT variable
const listener = app.listen(PORT, () => {
    console.log(`\nServer is listening on PORT ${PORT}\n`);
});
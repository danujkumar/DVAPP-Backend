require('dotenv').config();
const express = require('express');
const { connectToDb, getDb } = require('./src/configuration/config');
const port = process.env.PORT || 3000;
const app = express();
const path = require('path')
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routes/users.js");
const cors = require('cors');
let db;

app.use(cors({ origin: '*' }));

const server = require('http').createServer(app);

// db connection
connectToDb((err) => {
    if (!err) {
        server.listen(port, () => {
            console.log('Listen to the port: ' + port);
        });
        db = getDb();
    }
});

app.use('/models', express.static(path.join(__dirname, 'src', 'image')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(userRouter)
app.use("/uploads", express.static("uploads"));

//This is the starting point of our application
app.get('/', (req, res) => {
    res.send('Welcome to blockchain voting system !!');
});

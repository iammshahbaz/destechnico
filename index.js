const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const sellerRouter = require('./Routes/sellerRoutes');
const userRouter = require('./Routes/userRoutes');
const buyerRouter = require('./Routes/buyerRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.get("/", async (req, res) => {
    res.send("Welcome to Homepage ")
})

app.use('/api/users', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/buyer', buyerRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found.' });
});

app.listen(process.env.DB_PORT, async () => {
    try {
        console.log("connected to db");
        console.log(`Server is running at ${process.env.DB_PORT}`)
    } catch (error) {
        console.log("Error connecting to db")
    }
})
